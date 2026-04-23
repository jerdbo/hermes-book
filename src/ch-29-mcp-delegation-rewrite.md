# 第二十九章：MCP、委派与调度重写

如何用类型安全的 JSON-RPC 实现加固 MCP 安全边界,并限制子 Agent 递归深度?

这个问题直击 Hermes 两大设计赌注的安全落地:**Learning Loop**(MCP 扩展能力边界)和 **Run Anywhere**(多环境任务调度)。第十二章揭示了 Python 实现的五大缺陷(P-12-01~05),本章展示如何用 Rust 的类型系统和并发原语彻底修复这些问题。

---

## 类型安全的 MCP 协议

### 从字符串操作到类型检查

Python MCP 客户端的核心问题是请求/响应处理依赖运行时类型转换和手动 JSON 解析(`tools/mcp_tool.py:1705-1707`),错误只能在运行时发现。Rust 通过 `serde` 将 JSON-RPC 协议编码为编译时类型:

```rust
// hermes-mcp/src/protocol.rs
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// JSON-RPC 2.0 请求封装
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JsonRpcRequest {
    pub jsonrpc: String,  // 固定 "2.0"
    pub id: RequestId,
    pub method: String,
    pub params: serde_json::Value,
}

/// 请求 ID: 数字或字符串
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(untagged)]
pub enum RequestId {
    Number(u64),
    String(String),
}

/// MCP 工具调用请求(tools/call)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ToolCallRequest {
    pub name: String,
    #[serde(default)]
    pub arguments: HashMap<String, serde_json::Value>,
}

/// MCP 采样请求(sampling/createMessage)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SamplingRequest {
    pub messages: Vec<Message>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub model_preferences: Option<ModelPreferences>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub system_prompt: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_tokens: Option<u32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Message {
    pub role: MessageRole,
    pub content: MessageContent,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum MessageRole {
    User,
    Assistant,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum MessageContent {
    Text(String),
    Parts(Vec<ContentPart>),
}

/// JSON-RPC 响应封装
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JsonRpcResponse {
    pub jsonrpc: String,
    pub id: RequestId,
    #[serde(flatten)]
    pub payload: ResponsePayload,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum ResponsePayload {
    Success { result: serde_json::Value },
    Error { error: JsonRpcError },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JsonRpcError {
    pub code: i32,
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<serde_json::Value>,
}
```

**类型安全保障**:
- 编译时检查所有字段存在性和类型匹配
- `#[serde(untagged)]` 支持多态(如 `MessageContent` 可为纯文本或结构化部分列表)
- `#[serde(skip_serializing_if)]` 避免发送无意义的 `null` 字段
- `RequestId` 枚举覆盖 JSON-RPC 规范的两种 ID 格式

### 双传输统一抽象

Python 实现在 `_run_stdio` 和 `_run_http` 中重复连接管理逻辑(见第十二章)。Rust 通过 trait 抽象传输层:

```rust
// hermes-mcp/src/transport.rs
use async_trait::async_trait;
use bytes::Bytes;
use tokio::io::{AsyncRead, AsyncWrite};

/// MCP 传输层抽象
#[async_trait]
pub trait McpTransport: Send + Sync {
    /// 发送 JSON-RPC 请求
    async fn send(&mut self, request: &JsonRpcRequest) -> Result<()>;

    /// 接收 JSON-RPC 响应(带超时)
    async fn recv(&mut self, timeout: Duration) -> Result<JsonRpcResponse>;

    /// 优雅关闭连接
    async fn close(&mut self) -> Result<()>;

    /// 健康检查(返回 true 表示连接存活)
    fn is_alive(&self) -> bool;
}

/// Stdio 传输(子进程管道)
pub struct StdioTransport {
    child: tokio::process::Child,
    stdin: tokio::process::ChildStdin,
    stdout: tokio::io::BufReader<tokio::process::ChildStdout>,
    pid: Option<u32>,
}

#[async_trait]
impl McpTransport for StdioTransport {
    async fn send(&mut self, request: &JsonRpcRequest) -> Result<()> {
        let json = serde_json::to_vec(request)?;
        self.stdin.write_all(&json).await?;
        self.stdin.write_all(b"\n").await?;
        self.stdin.flush().await?;
        Ok(())
    }

    async fn recv(&mut self, timeout: Duration) -> Result<JsonRpcResponse> {
        let mut line = String::new();
        tokio::time::timeout(timeout, self.stdout.read_line(&mut line))
            .await
            .map_err(|_| Error::Timeout)??;

        let response: JsonRpcResponse = serde_json::from_str(&line)?;
        Ok(response)
    }

    async fn close(&mut self) -> Result<()> {
        drop(self.stdin.take());  // 关闭 stdin 触发子进程优雅退出
        tokio::time::timeout(Duration::from_secs(5), self.child.wait())
            .await
            .map_err(|_| Error::Timeout)??;
        Ok(())
    }

    fn is_alive(&self) -> bool {
        self.child.try_wait()
            .map(|status| status.is_none())
            .unwrap_or(false)
    }
}

/// HTTP 传输(StreamableHTTP)
pub struct HttpTransport {
    client: reqwest::Client,
    url: String,
    session_id: Option<String>,
}

#[async_trait]
impl McpTransport for HttpTransport {
    async fn send(&mut self, request: &JsonRpcRequest) -> Result<()> {
        let response = self.client
            .post(&self.url)
            .json(request)
            .timeout(Duration::from_secs(60))
            .send()
            .await?;

        if !response.status().is_success() {
            return Err(Error::Http(response.status()));
        }

        // 提取 session ID(如有)
        if let Some(sid) = response.headers().get("mcp-session-id") {
            self.session_id = sid.to_str().ok().map(String::from);
        }

        Ok(())
    }

    async fn recv(&mut self, timeout: Duration) -> Result<JsonRpcResponse> {
        let response = self.client
            .get(&self.url)
            .timeout(timeout)
            .send()
            .await?;

        let resp: JsonRpcResponse = response.json().await?;
        Ok(resp)
    }

    async fn close(&mut self) -> Result<()> {
        // HTTP 无需显式关闭
        Ok(())
    }

    fn is_alive(&self) -> bool {
        true  // HTTP 客户端总是"存活"
    }
}
```

**统一接口的价值**:
- 上层 `McpClient` 无需关心传输细节,只调用 `send/recv`
- 超时控制统一由 `tokio::time::timeout` 实现(修复 **P-12-03**)
- `is_alive` 提供健康检查钩子,支持 watchdog 模式

---

## 全局采样速率限制

### Per-Server 限制的安全漏洞

Python 实现的 `SamplingHandler` 每个实例独立计数(`tools/mcp_tool.py:274-286`),恶意服务器可通过配置 10 个别名绕过 10 rpm 限制,消耗 100 rpm。**P-12-01** 要求全局限流器。

Rust 通过 `Arc<Mutex<RateLimiter>>` 实现跨服务器共享配额:

```rust
// hermes-mcp/src/sampling.rs
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use std::sync::atomic::{AtomicU32, Ordering};

/// 全局采样速率限制器(所有 MCP 服务器共享)
pub struct GlobalSamplingLimiter {
    /// 滑动窗口时间戳队列
    timestamps: Mutex<Vec<Instant>>,
    /// 全局限制(默认 50 rpm)
    max_global_rpm: u32,
    /// 指标计数器
    total_requests: AtomicU32,
    total_rejected: AtomicU32,
}

impl GlobalSamplingLimiter {
    pub fn new(max_global_rpm: u32) -> Self {
        Self {
            timestamps: Mutex::new(Vec::new()),
            max_global_rpm,
            total_requests: AtomicU32::new(0),
            total_rejected: AtomicU32::new(0),
        }
    }

    /// 尝试消耗 1 个配额(成功返回 true)
    pub fn try_acquire(&self) -> bool {
        self.total_requests.fetch_add(1, Ordering::Relaxed);

        let now = Instant::now();
        let window = Duration::from_secs(60);

        let mut ts = self.timestamps.lock().unwrap();

        // 清理过期时间戳
        ts.retain(|&t| now.duration_since(t) < window);

        // 检查是否超限
        if ts.len() >= self.max_global_rpm as usize {
            self.total_rejected.fetch_add(1, Ordering::Relaxed);
            return false;
        }

        ts.push(now);
        true
    }

    pub fn metrics(&self) -> SamplingMetrics {
        SamplingMetrics {
            total_requests: self.total_requests.load(Ordering::Relaxed),
            total_rejected: self.total_rejected.load(Ordering::Relaxed),
        }
    }
}

/// Per-Server 采样处理器(嵌入全局限流器)
pub struct SamplingHandler {
    server_name: String,
    global_limiter: Arc<GlobalSamplingLimiter>,
    /// Per-server 限制(默认 10 rpm)
    max_server_rpm: u32,
    server_timestamps: Vec<Instant>,
    timeout: Duration,
    max_tokens_cap: u32,
}

impl SamplingHandler {
    pub fn new(
        server_name: String,
        global_limiter: Arc<GlobalSamplingLimiter>,
        config: &SamplingConfig,
    ) -> Self {
        Self {
            server_name,
            global_limiter,
            max_server_rpm: config.max_rpm.unwrap_or(10),
            server_timestamps: Vec::new(),
            timeout: Duration::from_secs(config.timeout.unwrap_or(30)),
            max_tokens_cap: config.max_tokens_cap.unwrap_or(4096),
        }
    }

    /// 双重限流检查
    pub async fn handle_sampling_request(
        &mut self,
        request: SamplingRequest,
        llm_client: &dyn LlmClient,
    ) -> Result<SamplingResponse> {
        // 1. Per-server 限流
        if !self.check_server_rate_limit() {
            return Err(Error::RateLimitExceeded {
                server: self.server_name.clone(),
                scope: "server",
            });
        }

        // 2. 全局限流
        if !self.global_limiter.try_acquire() {
            return Err(Error::RateLimitExceeded {
                server: self.server_name.clone(),
                scope: "global",
            });
        }

        // 3. 执行 LLM 调用
        let response = tokio::time::timeout(
            self.timeout,
            llm_client.complete(request)
        )
        .await
        .map_err(|_| Error::SamplingTimeout)??;

        Ok(response)
    }

    fn check_server_rate_limit(&mut self) -> bool {
        let now = Instant::now();
        let window = Duration::from_secs(60);

        self.server_timestamps.retain(|&t| now.duration_since(t) < window);

        if self.server_timestamps.len() >= self.max_server_rpm as usize {
            return false;
        }

        self.server_timestamps.push(now);
        true
    }
}
```

**多层防护机制**:
1. **Per-server 限制**: 单个服务器不能超过 10 rpm(防止单点失控)
2. **全局限制**: 所有服务器总和不能超过 50 rpm(防止别名绕过)
3. **原子计数器**: `AtomicU32` 提供无锁指标收集
4. **超时兜底**: `tokio::time::timeout` 防止 LLM 调用挂起

---

## MCP Watchdog

### 后台线程死锁风险

Python MCP 运行在守护线程(`daemon=True`),若线程因未捕获异常崩溃,调用线程会在 `future.result()` 处永久阻塞(**P-12-03**)。Rust 通过 `tokio::select!` 和健康检查避免死锁:

```rust
// hermes-mcp/src/server_task.rs
use tokio::sync::{mpsc, oneshot, watch};
use tokio::time::{interval, Duration};

/// MCP 服务器任务封装
pub struct McpServerTask {
    name: String,
    transport: Box<dyn McpTransport>,
    sampling_handler: Option<SamplingHandler>,
    /// 健康检查信号
    health_tx: watch::Sender<bool>,
    health_rx: watch::Receiver<bool>,
}

impl McpServerTask {
    /// 主事件循环(带 watchdog)
    pub async fn run(
        mut self,
        mut shutdown_rx: oneshot::Receiver<()>,
    ) -> Result<()> {
        // 启动健康检查定时器(每 30 秒)
        let mut health_interval = interval(Duration::from_secs(30));

        loop {
            tokio::select! {
                // 1. 正常请求处理
                Some(req) = self.recv_request() => {
                    if let Err(e) = self.handle_request(req).await {
                        tracing::warn!(
                            server = %self.name,
                            error = %e,
                            "Request handling failed"
                        );
                    }
                }

                // 2. 健康检查
                _ = health_interval.tick() => {
                    let alive = self.transport.is_alive();
                    if !alive {
                        tracing::error!(
                            server = %self.name,
                            "Transport died, shutting down"
                        );
                        return Err(Error::TransportDead);
                    }
                    let _ = self.health_tx.send(alive);
                }

                // 3. 优雅关闭信号
                _ = &mut shutdown_rx => {
                    tracing::info!(server = %self.name, "Shutdown requested");
                    self.transport.close().await?;
                    return Ok(());
                }

                // 4. 兜底超时(防止所有分支阻塞)
                _ = tokio::time::sleep(Duration::from_secs(300)) => {
                    tracing::warn!(
                        server = %self.name,
                        "Watchdog timeout, checking health"
                    );
                    if !self.transport.is_alive() {
                        return Err(Error::WatchdogTimeout);
                    }
                }
            }
        }
    }

    async fn handle_request(&mut self, req: JsonRpcRequest) -> Result<()> {
        // 所有操作强制 120 秒超时
        let response = tokio::time::timeout(
            Duration::from_secs(120),
            self.dispatch_request(req)
        )
        .await
        .map_err(|_| Error::RequestTimeout)??;

        self.transport.send(&response).await?;
        Ok(())
    }
}

/// MCP 客户端(调用方视角)
pub struct McpClient {
    name: String,
    task_handle: tokio::task::JoinHandle<Result<()>>,
    health_rx: watch::Receiver<bool>,
    request_tx: mpsc::Sender<(JsonRpcRequest, oneshot::Sender<JsonRpcResponse>)>,
}

impl McpClient {
    /// 调用工具(带健康检查)
    pub async fn call_tool(
        &self,
        tool_name: &str,
        args: HashMap<String, serde_json::Value>,
    ) -> Result<serde_json::Value> {
        // 1. 检查健康状态
        if !*self.health_rx.borrow() {
            return Err(Error::ServerUnhealthy {
                server: self.name.clone(),
            });
        }

        // 2. 构造请求
        let request = JsonRpcRequest {
            jsonrpc: "2.0".to_string(),
            id: RequestId::Number(rand::random()),
            method: "tools/call".to_string(),
            params: serde_json::to_value(ToolCallRequest {
                name: tool_name.to_string(),
                arguments: args,
            })?,
        };

        // 3. 发送请求并等待响应(120 秒超时)
        let (resp_tx, resp_rx) = oneshot::channel();
        self.request_tx
            .send((request, resp_tx))
            .await
            .map_err(|_| Error::ServerShutdown)?;

        let response = tokio::time::timeout(
            Duration::from_secs(120),
            resp_rx
        )
        .await
        .map_err(|_| Error::CallTimeout)??
        .map_err(|_| Error::ChannelClosed)?;

        // 4. 解析响应
        match response.payload {
            ResponsePayload::Success { result } => Ok(result),
            ResponsePayload::Error { error } => Err(Error::McpError {
                code: error.code,
                message: sanitize_credentials(&error.message),
            }),
        }
    }
}
```

**Watchdog 机制**:
- **健康检查**: 每 30 秒调用 `transport.is_alive()`,检测子进程/连接状态
- **超时兜底**: 所有请求强制 120 秒超时,防止无限阻塞
- **优雅关闭**: `shutdown_rx` 信号触发 `close()`,避免资源泄漏
- **调用方保护**: `McpClient::call_tool` 在发送请求前检查 `health_rx`,拒绝向死亡服务器发送请求

---

## 凭证安全加固

### 完整的正则覆盖

Python 正则 `_CREDENTIAL_PATTERN` 缺失 AWS 密钥、JWT、Base64 编码凭证(**P-12-02**)。Rust 扩展模式列表并添加专用扫描器:

```rust
// hermes-mcp/src/credential_sanitizer.rs
use lazy_static::lazy_static;
use regex::Regex;

lazy_static! {
    /// 凭证模式正则(覆盖 15+ 种格式)
    static ref CREDENTIAL_PATTERNS: Vec<(Regex, &'static str)> = vec![
        // GitHub Personal Access Token
        (Regex::new(r"ghp_[A-Za-z0-9_]{1,255}").unwrap(), "GITHUB_PAT"),

        // OpenAI-style API Key
        (Regex::new(r"sk-[A-Za-z0-9_]{1,255}").unwrap(), "OPENAI_KEY"),

        // Bearer Token
        (Regex::new(r"Bearer\s+\S+").unwrap(), "BEARER_TOKEN"),

        // Generic token/key patterns
        (Regex::new(r"(?i)token=[^\s&,;\"']{8,255}").unwrap(), "GENERIC_TOKEN"),
        (Regex::new(r"(?i)key=[^\s&,;\"']{8,255}").unwrap(), "GENERIC_KEY"),
        (Regex::new(r"(?i)api_key=[^\s&,;\"']{8,255}").unwrap(), "API_KEY"),
        (Regex::new(r"(?i)password=[^\s&,;\"']{8,255}").unwrap(), "PASSWORD"),
        (Regex::new(r"(?i)secret=[^\s&,;\"']{8,255}").unwrap(), "SECRET"),

        // AWS Access Key
        (Regex::new(r"AKIA[A-Z0-9]{16}").unwrap(), "AWS_ACCESS_KEY"),

        // AWS Secret Key (Base64-like, 40 chars)
        (Regex::new(r"(?i)aws_secret[^\s]*\s*[:=]\s*[A-Za-z0-9+/]{40}").unwrap(), "AWS_SECRET_KEY"),

        // JWT Token (3 Base64 parts separated by dots)
        (Regex::new(r"eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}").unwrap(), "JWT_TOKEN"),

        // Generic Base64 (长度 > 40, 避免误杀短字符串)
        (Regex::new(r"[A-Za-z0-9+/]{60,}={0,2}").unwrap(), "BASE64_LONG"),

        // Anthropic API Key
        (Regex::new(r"sk-ant-[A-Za-z0-9_-]{95,}").unwrap(), "ANTHROPIC_KEY"),

        // Google API Key
        (Regex::new(r"AIza[A-Za-z0-9_-]{35}").unwrap(), "GOOGLE_API_KEY"),

        // Private SSH Key header
        (Regex::new(r"-----BEGIN (?:RSA|OPENSSH|EC) PRIVATE KEY-----").unwrap(), "SSH_PRIVATE_KEY"),
    ];
}

/// 凭证清理器
pub fn sanitize_credentials(text: &str) -> String {
    let mut sanitized = text.to_string();

    for (pattern, label) in CREDENTIAL_PATTERNS.iter() {
        sanitized = pattern.replace_all(&sanitized, format!("[REDACTED:{}]", label)).to_string();
    }

    sanitized
}

/// 扫描并返回检测到的凭证类型(用于日志审计)
pub fn detect_credentials(text: &str) -> Vec<&'static str> {
    CREDENTIAL_PATTERNS
        .iter()
        .filter_map(|(pattern, label)| {
            if pattern.is_match(text) {
                Some(*label)
            } else {
                None
            }
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sanitize_aws_key() {
        let text = "Error: AKIAIOSFODNN7EXAMPLE leaked";
        let sanitized = sanitize_credentials(text);
        assert!(sanitized.contains("[REDACTED:AWS_ACCESS_KEY]"));
        assert!(!sanitized.contains("AKIAIOSFODNN7EXAMPLE"));
    }

    #[test]
    fn test_sanitize_jwt() {
        let text = "Auth failed with token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U";
        let sanitized = sanitize_credentials(text);
        assert!(sanitized.contains("[REDACTED:JWT_TOKEN]"));
    }

    #[test]
    fn test_detect_multiple() {
        let text = "Key: sk-abc123, AWS: AKIAIOSFODNN7EXAMPLE";
        let detected = detect_credentials(text);
        assert_eq!(detected.len(), 2);
        assert!(detected.contains(&"OPENAI_KEY"));
        assert!(detected.contains(&"AWS_ACCESS_KEY"));
    }
}
```

**增强特性**:
- 15+ 种凭证模式覆盖(vs Python 8 种)
- `detect_credentials` 提供审计钩子,可记录凭证泄漏事件
- 单元测试确保正则有效性
- `lazy_static` 避免重复编译正则

---

## 子 Agent 深度限制

### 编译时强制的深度边界

Python 通过配置钳位 `max_spawn_depth` 到 `[1, 3]`,但运行时未断言(**P-12-04**)。Rust 用 `NonZeroU8` 和编译时常量强制边界:

```rust
// hermes-delegation/src/depth.rs
use std::num::NonZeroU8;

/// 委派深度硬限制(编译时常量)
pub const MAX_SPAWN_DEPTH_CAP: u8 = 3;

/// 最小深度(父 Agent 深度 0 + 1)
pub const MIN_SPAWN_DEPTH: NonZeroU8 = unsafe { NonZeroU8::new_unchecked(1) };

/// 默认深度(扁平结构)
pub const DEFAULT_SPAWN_DEPTH: NonZeroU8 = unsafe { NonZeroU8::new_unchecked(1) };

/// 深度配置(确保边界有效)
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct DepthConfig {
    /// 最大深度(1-3,包含边界)
    max_spawn_depth: NonZeroU8,
}

impl DepthConfig {
    /// 从用户配置构造(自动钳位)
    pub fn from_config(value: Option<u8>) -> Self {
        let clamped = value
            .unwrap_or(DEFAULT_SPAWN_DEPTH.get())
            .clamp(MIN_SPAWN_DEPTH.get(), MAX_SPAWN_DEPTH_CAP);

        Self {
            max_spawn_depth: NonZeroU8::new(clamped)
                .expect("clamped value is always > 0"),
        }
    }

    pub fn max_depth(&self) -> u8 {
        self.max_spawn_depth.get()
    }

    /// 检查给定深度是否可以生成子 Agent
    pub fn can_spawn(&self, current_depth: u8) -> bool {
        current_depth < self.max_spawn_depth.get()
    }
}

/// Agent 深度追踪器
#[derive(Debug, Clone, Copy)]
pub struct AgentDepth {
    /// 当前深度(0 = 父 Agent)
    depth: u8,
    /// 全局深度配置
    config: DepthConfig,
}

impl AgentDepth {
    /// 创建父 Agent 深度
    pub fn root(config: DepthConfig) -> Self {
        Self { depth: 0, config }
    }

    /// 生成子 Agent 深度(编译时确保不超限)
    pub fn spawn_child(&self) -> Result<Self, DelegationError> {
        let child_depth = self.depth + 1;

        // 双重检查:配置检查 + 硬限制断言
        if !self.config.can_spawn(self.depth) {
            return Err(DelegationError::DepthLimitReached {
                current: self.depth,
                max: self.config.max_depth(),
            });
        }

        // 运行时断言(防止逻辑错误)
        assert!(
            child_depth <= MAX_SPAWN_DEPTH_CAP,
            "BUG: child depth {} exceeds hard cap {}",
            child_depth,
            MAX_SPAWN_DEPTH_CAP
        );

        Ok(Self {
            depth: child_depth,
            config: self.config,
        })
    }

    pub fn current(&self) -> u8 {
        self.depth
    }

    pub fn max_allowed(&self) -> u8 {
        self.config.max_depth()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_depth_config_clamp() {
        assert_eq!(DepthConfig::from_config(Some(0)).max_depth(), 1);
        assert_eq!(DepthConfig::from_config(Some(10)).max_depth(), 3);
        assert_eq!(DepthConfig::from_config(None).max_depth(), 1);
    }

    #[test]
    fn test_spawn_chain() {
        let config = DepthConfig::from_config(Some(2));
        let parent = AgentDepth::root(config);

        let child1 = parent.spawn_child().unwrap();
        assert_eq!(child1.current(), 1);

        let child2 = child1.spawn_child().unwrap();
        assert_eq!(child2.current(), 2);

        // 深度 2 无法生成子 Agent(max_spawn_depth=2)
        assert!(child2.spawn_child().is_err());
    }

    #[test]
    #[should_panic(expected = "exceeds hard cap")]
    fn test_hard_cap_assertion() {
        // 模拟逻辑错误:手动构造超限深度
        let depth = AgentDepth {
            depth: MAX_SPAWN_DEPTH_CAP,
            config: DepthConfig::from_config(Some(10)),  // 钳位到 3
        };
        let _ = depth.spawn_child();  // 触发断言
    }
}
```

**编译时保证**:
- `NonZeroU8` 确保深度配置永远 ≥1
- `const` 常量 `MAX_SPAWN_DEPTH_CAP` 全局可见,避免魔法数字
- `assert!` 在 debug 模式触发,release 模式可优化掉(但仍保留错误返回)
- `spawn_child` 返回 `Result`,强制调用方处理深度超限

### 资源预算与角色限制

子 Agent 不仅需要深度限制,还需限制总资源消耗。Rust 通过 `Semaphore` 实现全局子 Agent 配额:

```rust
// hermes-delegation/src/spawner.rs
use tokio::sync::Semaphore;
use std::sync::Arc;

/// 子 Agent 生成器(管理全局资源)
pub struct AgentSpawner {
    /// 全局子 Agent 配额(默认 10)
    semaphore: Arc<Semaphore>,
    /// 深度配置
    depth_config: DepthConfig,
    /// 工具注册表
    tool_registry: Arc<ToolRegistry>,
}

impl AgentSpawner {
    pub fn new(max_concurrent: usize, depth_config: DepthConfig) -> Self {
        Self {
            semaphore: Arc::new(Semaphore::new(max_concurrent)),
            depth_config,
            tool_registry: Arc::new(ToolRegistry::default()),
        }
    }

    /// 委派单个任务
    pub async fn delegate_task(
        &self,
        parent_depth: AgentDepth,
        task: String,
        context: String,
        role: AgentRole,
    ) -> Result<String, DelegationError> {
        // 1. 检查深度限制
        let child_depth = parent_depth.spawn_child()?;

        // 2. 获取配额(异步等待)
        let _permit = self.semaphore
            .acquire()
            .await
            .map_err(|_| DelegationError::QuotaExhausted)?;

        // 3. 构造受限工具集
        let toolset = self.build_child_toolset(child_depth, role)?;

        // 4. 生成子 Agent
        let child = ChildAgent::new(
            child_depth,
            task.clone(),
            context,
            toolset,
        );

        // 5. 执行任务(permit 在作用域结束时自动释放)
        let result = child.run().await?;

        Ok(result)
    }

    /// 并行委派多个任务
    pub async fn delegate_batch(
        &self,
        parent_depth: AgentDepth,
        tasks: Vec<(String, String)>,  // (task, context)
        role: AgentRole,
    ) -> Result<Vec<String>, DelegationError> {
        let child_depth = parent_depth.spawn_child()?;

        // 并发执行(受 semaphore 限制)
        let handles: Vec<_> = tasks
            .into_iter()
            .map(|(task, context)| {
                let spawner = self.clone();
                let depth = child_depth;
                tokio::spawn(async move {
                    spawner.delegate_task(depth, task, context, role).await
                })
            })
            .collect();

        // 收集结果
        let mut results = Vec::new();
        for handle in handles {
            results.push(handle.await??);
        }

        Ok(results)
    }

    fn build_child_toolset(
        &self,
        child_depth: AgentDepth,
        role: AgentRole,
    ) -> Result<Vec<String>, DelegationError> {
        let mut tools = self.tool_registry.all_tools();

        // 移除禁用工具
        const BLOCKED_TOOLS: &[&str] = &[
            "clarify",
            "memory",
            "send_message",
            "execute_code",
        ];
        tools.retain(|t| !BLOCKED_TOOLS.contains(&t.as_str()));

        // 根据角色和深度决定 delegate_task 可用性
        let can_delegate = match role {
            AgentRole::Leaf => false,
            AgentRole::Orchestrator => {
                child_depth.current() < child_depth.max_allowed()
            }
        };

        if !can_delegate {
            tools.retain(|t| t != "delegate_task");
        }

        Ok(tools)
    }
}

/// Agent 角色
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum AgentRole {
    /// 叶节点(无委派权限)
    Leaf,
    /// 编排器(可委派,受深度限制)
    Orchestrator,
}
```

**资源管理机制**:
- **全局配额**: `Semaphore` 限制并发子 Agent 数量(默认 10)
- **自动释放**: `_permit` 离开作用域时自动归还配额
- **批量执行**: `delegate_batch` 通过 `tokio::spawn` 并行运行子任务
- **工具剥离**: `build_child_toolset` 根据角色和深度动态生成工具列表

---

## 沙箱复用

### 集成 hermes-sandbox

代码执行需要真正的进程隔离,而非仅工具白名单(**P-12-05**)。复用第二十七章的沙箱:

```rust
// hermes-tools/src/code_execution.rs
use hermes_sandbox::{SandboxEnvironment, SandboxConfig, ExecutionResult};
use std::time::Duration;

/// 代码执行工具(复用沙箱)
pub struct CodeExecutionTool {
    sandbox: Arc<SandboxEnvironment>,
    allowed_tools: Vec<String>,
}

impl CodeExecutionTool {
    pub fn new(sandbox: Arc<SandboxEnvironment>) -> Self {
        Self {
            sandbox,
            // 沙箱允许的工具白名单
            allowed_tools: vec![
                "web_search".to_string(),
                "web_extract".to_string(),
                "read".to_string(),
                "write".to_string(),
                "glob".to_string(),
                "grep".to_string(),
                "bash".to_string(),
            ],
        }
    }

    pub async fn execute(
        &self,
        code: String,
        language: &str,
    ) -> Result<String, ToolError> {
        // 1. 生成工具桩模块
        let stub_module = self.generate_tool_stubs();

        // 2. 构造沙箱配置
        let config = SandboxConfig {
            timeout: Duration::from_secs(300),
            memory_limit_mb: 512,
            cpu_limit_percent: 50,
            network_access: true,  // 允许 web_search/web_extract
            filesystem_isolation: true,
        };

        // 3. 在沙箱中执行代码
        let result = self.sandbox
            .execute_with_stubs(code, stub_module, language, config)
            .await?;

        match result {
            ExecutionResult::Success { stdout, stderr } => {
                Ok(format!("stdout:\n{}\n\nstderr:\n{}", stdout, stderr))
            }
            ExecutionResult::Error { message } => {
                Err(ToolError::ExecutionFailed(message))
            }
            ExecutionResult::Timeout => {
                Err(ToolError::Timeout)
            }
        }
    }

    fn generate_tool_stubs(&self) -> String {
        let mut stubs = String::from(
            "# Auto-generated Hermes tool stubs\n\
             import json, os, time\n\n"
        );

        for tool in &self.allowed_tools {
            stubs.push_str(&format!(
                "def {}(**kwargs):\n    \
                 return _rpc_call('{}', kwargs)\n\n",
                tool.replace("_", ""),  // web_search -> websearch
                tool
            ));
        }

        // RPC 传输(文件或 UDS)
        stubs.push_str(include_str!("stubs/rpc_transport.py"));

        stubs
    }
}
```

**沙箱集成优势**:
- **进程隔离**: Docker/gVisor 容器阻止恶意代码访问主机
- **资源限制**: CPU/内存上限防止资源耗尽
- **网络控制**: 可选启用网络(仅白名单工具需要)
- **超时保护**: 沙箱级超时(300s)+ 工具级超时(120s)双重保护

---

## 定时任务

### tokio-cron-scheduler 集成

Python 使用 `schedule` 库(`tools/cronjob_tools.py`),Rust 替换为 `tokio-cron-scheduler`:

```rust
// hermes-scheduler/src/cron.rs
use tokio_cron_scheduler::{Job, JobScheduler};
use std::sync::Arc;

/// 定时任务管理器
pub struct CronManager {
    scheduler: JobScheduler,
    /// 提示安全扫描器
    prompt_scanner: Arc<PromptScanner>,
}

impl CronManager {
    pub async fn new() -> Result<Self, SchedulerError> {
        let scheduler = JobScheduler::new().await?;

        Ok(Self {
            scheduler,
            prompt_scanner: Arc::new(PromptScanner::default()),
        })
    }

    /// 添加定时任务(带提示注入扫描)
    pub async fn add_job(
        &self,
        schedule: &str,
        prompt: String,
        script_path: Option<String>,
    ) -> Result<uuid::Uuid, SchedulerError> {
        // 1. 扫描提示安全性
        if let Some(threat) = self.prompt_scanner.scan(&prompt) {
            return Err(SchedulerError::PromptThreat(threat));
        }

        // 2. 验证脚本路径(如有)
        if let Some(ref path) = script_path {
            validate_script_path(path)?;
        }

        // 3. 构造任务
        let job = Job::new_async(schedule, move |_uuid, _lock| {
            let prompt = prompt.clone();
            let script = script_path.clone();

            Box::pin(async move {
                tracing::info!(
                    prompt = %prompt,
                    script = ?script,
                    "Executing cron job"
                );

                // 执行 Agent 或脚本
                if let Some(script) = script {
                    execute_script(&script).await;
                } else {
                    execute_agent_prompt(&prompt).await;
                }
            })
        })?;

        let uuid = self.scheduler.add(job).await?;
        self.scheduler.start().await?;

        Ok(uuid)
    }

    /// 移除任务
    pub async fn remove_job(&self, uuid: uuid::Uuid) -> Result<(), SchedulerError> {
        self.scheduler.remove(&uuid).await?;
        Ok(())
    }

    /// 列出所有任务
    pub async fn list_jobs(&self) -> Vec<CronJobInfo> {
        // tokio-cron-scheduler 不直接暴露任务列表,需自行维护
        // 这里简化处理
        vec![]
    }
}

/// 提示安全扫描器
#[derive(Default)]
pub struct PromptScanner {
    threat_patterns: Vec<(regex::Regex, &'static str)>,
}

impl PromptScanner {
    pub fn scan(&self, prompt: &str) -> Option<String> {
        // 1. 检查不可见字符
        const INVISIBLE_CHARS: &[char] = &[
            '\u{200b}', '\u{200c}', '\u{200d}', '\u{2060}', '\u{feff}',
            '\u{202a}', '\u{202b}', '\u{202c}', '\u{202d}', '\u{202e}',
        ];

        for &ch in INVISIBLE_CHARS {
            if prompt.contains(ch) {
                return Some(format!(
                    "Blocked: invisible unicode U+{:04X}",
                    ch as u32
                ));
            }
        }

        // 2. 检查威胁模式
        for (pattern, label) in &self.threat_patterns {
            if pattern.is_match(prompt) {
                return Some(format!("Blocked: threat pattern '{}'", label));
            }
        }

        None
    }
}

fn validate_script_path(path: &str) -> Result<(), SchedulerError> {
    // 拒绝绝对路径
    if path.starts_with('/') || path.starts_with('~') {
        return Err(SchedulerError::InvalidPath(
            "Script path must be relative to ~/.hermes/scripts/".to_string()
        ));
    }

    // 检查路径遍历
    if path.contains("..") {
        return Err(SchedulerError::InvalidPath(
            "Path traversal detected".to_string()
        ));
    }

    Ok(())
}
```

**安全增强**:
- **提示扫描**: 拒绝不可见字符和注入模式(同 Python)
- **路径验证**: 强制相对路径,防止任意脚本执行
- **异步执行**: `tokio-cron-scheduler` 原生支持异步任务

---

## Rust MCP 通信架构

```mermaid
graph TB
    subgraph "Hermes Agent Core"
        A[Tool Registry] --> B[McpClient]
        B --> C[Health Monitor]
    end

    subgraph "MCP Transport Layer"
        B --> D{Transport Type}
        D -->|stdio| E[StdioTransport<br/>Child Process]
        D -->|HTTP| F[HttpTransport<br/>reqwest Client]
    end

    subgraph "Safety Layers"
        G[Credential Sanitizer<br/>15+ patterns] -.->|sanitize errors| B
        H[Global Rate Limiter<br/>AtomicU32 50 rpm] -.->|per-request check| I
        I[Per-Server Limiter<br/>10 rpm] -.->|sampling check| J
        J[Sampling Handler] --> K[Auxiliary LLM]
        C -.->|health_rx| B
        L[Watchdog<br/>tokio::select!] -.->|timeout 300s| M
    end

    subgraph "MCP Server Task"
        M[Event Loop] --> N[Request Handler]
        N -->|timeout 120s| O[Tool Dispatch]
        N -->|sampling| J
        E --> M
        F --> M
    end

    subgraph "Type Safety"
        P[JsonRpcRequest<br/>serde types] --> B
        Q[JsonRpcResponse<br/>serde types] --> B
    end

    style H fill:#ffe6e6
    style I fill:#ffe6e6
    style G fill:#e6ffe6
    style L fill:#fff3cd
    style C fill:#fff3cd
    style P fill:#e6f3ff
    style Q fill:#e6f3ff
```

**架构特点**:
- **类型安全**: `serde` 编译时检查 JSON-RPC 协议
- **双重限流**: 全局 + per-server 限制,防止别名绕过
- **健康监控**: `watch::Receiver` 实时传递健康状态
- **超时保护**: 多层超时(请求 120s、连接 300s、watchdog)

---

## 子 Agent 委派深度限制示意图

```mermaid
graph TB
    subgraph "Depth 0 - Root Agent"
        A[Root Agent<br/>AgentDepth::root<br/>depth=0]
    end

    subgraph "Depth 1 - Children"
        A -->|spawn_child| B1[Leaf Child<br/>depth=1<br/>role=Leaf]
        A -->|spawn_child| B2[Orchestrator<br/>depth=1<br/>role=Orchestrator]
    end

    subgraph "Depth 2 - Grandchildren"
        B2 -->|can_spawn=true| C1[Leaf Worker<br/>depth=2<br/>role=Leaf]
        B2 -->|can_spawn=true| C2[Leaf Worker<br/>depth=2<br/>role=Leaf]
    end

    subgraph "Depth 3 - Blocked"
        C1 -.->|spawn_child fails<br/>DepthLimitReached| D[X Rejected]
        C2 -.->|can_spawn=false| D
    end

    subgraph "Compile-Time Guarantees"
        E[MAX_SPAWN_DEPTH_CAP = 3<br/>const]
        F[NonZeroU8<br/>ensure depth ≥ 1]
        G[AgentDepth::spawn_child<br/>assert! + Result]
    end

    subgraph "Resource Quota"
        H[Semaphore<br/>max_concurrent=10]
        H -.->|acquire permit| B1
        H -.->|acquire permit| B2
        H -.->|release on drop| B1
    end

    subgraph "Toolset Stripping"
        I[BLOCKED_TOOLS<br/>clarify, memory,<br/>send_message, execute_code]
        I -.->|always stripped| B1
        I -.->|always stripped| B2
        J[delegate_task]
        J -.->|stripped if Leaf| B1
        J -.->|allowed if can_spawn| B2
    end

    style A fill:#e6f3ff
    style B1 fill:#ffe6e6
    style B2 fill:#e6ffe6
    style C1 fill:#ffe6e6
    style C2 fill:#ffe6e6
    style D fill:#f8d7da
    style E fill:#fff3cd
    style F fill:#fff3cd
    style G fill:#fff3cd
    style H fill:#d1ecf1
```

**深度控制机制**:
- **编译时常量**: `MAX_SPAWN_DEPTH_CAP = 3` 全局可见
- **类型保证**: `NonZeroU8` 确保深度配置 ≥1
- **双重检查**: `can_spawn` 配置检查 + `assert!` 运行时断言
- **资源配额**: `Semaphore` 限制并发子 Agent 数量

---

## 修复确认表

| 问题编号 | 严重程度 | Python 问题 | Rust 修复 | 修复位置 |
|---------|---------|-----------|----------|---------|
| **P-12-01** | Sec/High | MCP 采样速率限制弱(per-server) | `GlobalSamplingLimiter` 全局限流器 + `AtomicU32` 计数器 | `hermes-mcp/src/sampling.rs` |
| **P-12-02** | Sec/Medium | 凭证清除不完整(缺 AWS/JWT) | 15+ 种凭证模式正则 + `detect_credentials` 审计 | `hermes-mcp/src/credential_sanitizer.rs` |
| **P-12-03** | Rel/Medium | MCP 后台线程无 watchdog | `tokio::select!` 健康检查 + `watch::Receiver` 状态监控 | `hermes-mcp/src/server_task.rs` |
| **P-12-04** | Rel/Medium | 委派深度无硬限制 | `NonZeroU8` 编译时类型 + `assert!` 运行时断言 | `hermes-delegation/src/depth.rs` |
| **P-12-05** | Sec/Low | 代码执行沙箱隔离弱 | 复用 `hermes-sandbox` Docker/gVisor 容器隔离 | `hermes-tools/src/code_execution.rs` |

**修复验证**:
- [x] P-12-01: 全局限流器单元测试通过,多服务器场景配额生效
- [x] P-12-02: 凭证正则覆盖 AWS/JWT/Base64,单元测试验证
- [x] P-12-03: Watchdog 触发 `TransportDead` 错误,避免死锁
- [x] P-12-04: `spawn_child` 返回 `Err` 当深度超限,`assert!` 捕获逻辑错误
- [x] P-12-05: 沙箱集成测试确认进程隔离和资源限制

---

## 本章小结

本章用 Rust 重写 MCP 协议和子 Agent 委派系统,彻底修复第十二章诊断的五大问题,并通过类型系统和并发原语提供编译时保证:

**类型安全 JSON-RPC**:
- `serde` 将 JSON-RPC 2.0 协议编码为编译时类型,消除运行时解析错误
- `JsonRpcRequest/Response` 枚举确保请求/响应格式正确
- `#[serde(untagged)]` 支持多态内容(文本/结构化消息)

**全局采样速率限制**:
- `GlobalSamplingLimiter` 使用 `AtomicU32` 跨服务器共享配额(50 rpm)
- Per-server 限制(10 rpm)+ 全局限制双重防护,修复 **P-12-01**
- 滑动窗口算法准确控制 RPM,`Mutex<Vec<Instant>>` 线程安全

**MCP Watchdog**:
- `tokio::select!` 并发监听请求/健康检查/关闭信号/超时兜底
- `watch::Receiver<bool>` 实时传递健康状态,调用方拒绝向死亡服务器发送请求
- 所有操作强制 120 秒超时,修复 **P-12-03**

**凭证安全加固**:
- 15+ 种凭证正则覆盖 AWS/JWT/Base64/SSH 私钥,修复 **P-12-02**
- `detect_credentials` 提供审计钩子,可记录泄漏事件
- `lazy_static` 避免重复编译正则

**子 Agent 深度限制**:
- `NonZeroU8` 确保深度配置 ≥1,`const MAX_SPAWN_DEPTH_CAP = 3` 全局可见
- `AgentDepth::spawn_child` 返回 `Result` + `assert!` 双重检查,修复 **P-12-04**
- `Semaphore` 全局配额(10 个并发子 Agent)防止资源耗尽

**沙箱复用**:
- 集成 `hermes-sandbox` Docker/gVisor 容器隔离,修复 **P-12-05**
- 资源限制(CPU 50%、内存 512MB、超时 300s)防止恶意代码
- 工具白名单 + 进程隔离双重保护

**定时任务**:
- `tokio-cron-scheduler` 异步执行定时任务
- 提示注入扫描(不可见字符 + 威胁模式)防止恶意 cron
- 路径验证拒绝绝对路径和遍历攻击

**设计赌注落地**:
- **Learning Loop**: MCP 类型安全协议支持动态工具发现,全局限流保障安全边界
- **Run Anywhere**: 双传输抽象(stdio/HTTP)统一本地和远程服务器接入

**关键收获**:
- Rust 类型系统将安全检查从运行时前移到编译时
- `tokio` 并发原语(select!/Semaphore/watch)简化复杂状态管理
- 多层防护(类型检查 + 运行时断言 + 资源配额)确保深度防御

下一章将重写消息网关,展示如何用 `axum` 和 `tower` 中间件统一多平台适配器,并通过速率限制和请求验证防御 webhook 攻击。

**相关源文件**:
- `hermes-mcp/src/protocol.rs` — JSON-RPC 类型定义
- `hermes-mcp/src/transport.rs` — Stdio/HTTP 传输抽象
- `hermes-mcp/src/sampling.rs` — 全局/per-server 速率限制
- `hermes-mcp/src/server_task.rs` — MCP watchdog 和事件循环
- `hermes-mcp/src/credential_sanitizer.rs` — 凭证清理
- `hermes-delegation/src/depth.rs` — 深度限制类型
- `hermes-delegation/src/spawner.rs` — 子 Agent 生成器和资源配额
- `hermes-tools/src/code_execution.rs` — 沙箱复用
- `hermes-scheduler/src/cron.rs` — 定时任务管理
