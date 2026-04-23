# 附录 C：术语表

> 中英文术语双语对照表，按英文字母顺序排列。

本术语表收录了全书出现的 80+ 核心技术术语，提供中文翻译、首次出现章节和简要说明。所有术语按英文字母顺序排列，方便快速查找。

---

## 如何使用本术语表

1. **按字母查找**：所有术语按 A-Z 排序
2. **定位章节**："首次出现"列标注了该术语在书中首次被详细解释的章节
3. **查看说明**：快速理解该术语在 Hermes 上下文中的具体含义

---

## A

| 英文术语 | 中文翻译 | 首次出现 | 说明 |
|---------|---------|---------|------|
| **Agent Loop** | Agent 循环 | Ch-03 | AI Agent 的核心循环：接收消息 → 调用 LLM → 执行工具 → 返回响应，直到任务完成 |
| **API Key** | API 密钥 | Ch-02 | 用于认证 LLM Provider 的凭证，Hermes 存储在 `~/.hermes/.env` 中（明文，P-02-02） |
| **Approval** | 审批 | Ch-10 | 在执行敏感命令前要求用户确认的机制，分为 Manual Approval 和 Smart Approval |
| **At-least-once** | 至少一次语义 | Ch-08 | 消息投递保证：每条消息至少被处理一次，可能重复（对应 SQLite WAL 模式） |
| **Auto-Memory** | 自动记忆 | Ch-01 | Claude Code 的功能，自动积累项目上下文笔记（每项目 25KB） |

## B

| 英文术语 | 中文翻译 | 首次出现 | 说明 |
|---------|---------|---------|------|
| **Backpressure** | 背压 | Ch-21 | 流式系统中，当消费速度慢于生产速度时，向上游施加压力以减缓生产的机制 |
| **Bash** | Bash Shell | Ch-10 | Linux/macOS 默认 Shell，Hermes 通过 `terminal` 工具执行 Bash 命令 |
| **Bedrock** | AWS Bedrock | Ch-04 | AWS 的托管 LLM 服务，Hermes 通过 `BedrockTransport` 适配 |
| **Builder Pattern** | 构建器模式 | Ch-20 | 用于逐步构建复杂对象的设计模式，Rust 中常用 `SomeType::builder().field1().field2().build()` |

## C

| 英文术语 | 中文翻译 | 首次出现 | 说明 |
|---------|---------|---------|------|
| **Cache Control** | 缓存控制 | Ch-04 | Anthropic Prompt Caching 的配置点，通过在消息中插入 `cache_control` 标记降低输入成本 ~75% |
| **CDP** | Chrome DevTools Protocol | Ch-11 | 浏览器自动化协议，Hermes 通过 Node.js `agent-browser` 桥接 CDP |
| **Channel** | 通道 | Ch-21 | Rust 异步编程中的消息传递原语，Tokio 提供 `mpsc`（多生产者单消费者）和 `oneshot`（一次性） |
| **CLI** | Command-Line Interface | Ch-15 | 命令行界面，Hermes 的主要交互方式，Python 版用 `prompt_toolkit`，Rust 版用 `clap` |
| **Compression** | 压缩 | Ch-06 | 上下文窗口超限时，对对话历史的压缩操作，Hermes 有两种模式：截断（truncation）和摘要（summary） |
| **Context Window** | 上下文窗口 | Ch-06 | LLM 单次处理的最大 Token 数，不同模型范围从 4K（早期 GPT-3.5）到 200K（Claude Opus） |
| **Crate** | Crate（包） | Ch-19 | Rust 的编译单元和依赖管理单位，Hermes Rust 版本拆分为 14 个 crate |

## D

| 英文术语 | 中文翻译 | 首次出现 | 说明 |
|---------|---------|---------|------|
| **DashMap** | DashMap | Ch-13 | Rust 的并发哈希表库，支持多线程安全读写，Hermes 用于 Gateway 的 Agent 缓存 |
| **Delegation** | 委派 | Ch-12 | 将子任务委派给独立的 Child Agent 执行，每个 Child Agent 有独立的预算和工具集 |
| **Derive Macro** | 派生宏 | Ch-20 | Rust 的过程宏，可自动为类型生成 trait 实现，如 `#[derive(Serialize)]` |
| **Docker** | Docker 容器 | Ch-27 | 轻量级虚拟化技术，Hermes Rust 版本可将代码执行放入 Docker 沙箱 |
| **Drop** | Drop Trait | Ch-21 | Rust 的析构 trait，当值离开作用域时自动调用，用于资源清理（如关闭文件、杀死子进程） |

## E

| 英文术语 | 中文翻译 | 首次出现 | 说明 |
|---------|---------|---------|------|
| **Enum** | 枚举 | Ch-22 | Rust 的代数数据类型，可携带数据的变体，用于状态机设计（如 `AgentState`） |
| **Extension Trait** | 扩展 Trait | Ch-20 | Rust 模式：为外部类型添加方法，如 `impl MyExt for Vec<T>` |

## F

| 英文术语 | 中文翻译 | 首次出现 | 说明 |
|---------|---------|---------|------|
| **Failover** | 故障转移 | Ch-03 | 当主 Provider 失败时，切换到备用 Provider 的机制 |
| **FTS5** | Full-Text Search 5 | Ch-08 | SQLite 的全文搜索扩展，Hermes 用于 `session_search` 工具 |

## G

| 英文术语 | 中文翻译 | 首次出现 | 说明 |
|---------|---------|---------|------|
| **Gateway** | 网关 | Ch-13 | Hermes 的多平台消息路由层，可同时连接 20+ 个消息平台（Telegram、Discord、微信等） |
| **Grace Call** | 恩赐调用 | Ch-03 | 达到最大迭代次数后，再给模型一次产出响应的机会（P-03-03：语义不清晰） |

## H-I

| 英文术语 | 中文翻译 | 首次出现 | 说明 |
|---------|---------|---------|------|
| **Idempotency** | 幂等性 | Ch-08 | 多次执行同一操作的结果与单次执行相同，SQLite WAL 模式提供 at-least-once 但需应用层保证幂等 |
| **Injection** | 提示注入 | Ch-05 | 恶意在上下文文件（如 `.hermes.md`）中插入指令覆盖系统提示的攻击方式 |
| **Inventory** | Inventory（库存） | Ch-09 | Python `inventory` 包，通过装饰器自动发现和注册工具，无需手动维护清单 |

## J

| 英文术语 | 中文翻译 | 首次出现 | 说明 |
|---------|---------|---------|------|
| **JoinSet** | JoinSet | Ch-21 | Tokio 的任务集合类型，用于管理多个并发任务的生命周期和结果收集 |
| **JSON-RPC** | JSON-RPC 协议 | Ch-12 | MCP 协议底层的消息格式，通过 stdio 或 HTTP 传输 |

## L

| 英文术语 | 中文翻译 | 首次出现 | 说明 |
|---------|---------|---------|------|
| **Landlock** | Landlock LSM | Ch-27 | Linux 5.13+ 内核的沙箱模块，可限制进程的文件系统和网络访问 |
| **LLM** | Large Language Model | Ch-01 | 大语言模型，Hermes 支持 20+ 个 Provider（Anthropic、OpenAI、Gemini 等） |
| **LRU** | Least Recently Used | Ch-13 | 最近最少使用缓存淘汰策略，Hermes Gateway 用于 Agent 实例缓存（128 上限） |

## M

| 英文术语 | 中文翻译 | 首次出现 | 说明 |
|---------|---------|---------|------|
| **MCP** | Model Context Protocol | Ch-12 | Anthropic 提出的 Agent 工具协议，支持 stdio 和 HTTP 两种传输方式 |
| **Memory Fencing** | 内存栅栏 | Ch-21 | 多线程编程中保证内存操作顺序的机制，Rust 通过 `std::sync::atomic::fence` 提供 |
| **Micro-compression** | 微压缩 | Ch-06 | 在触发完整压缩前，先删除冗余工具结果、合并重复内容的轻量压缩策略（P-06-02：缺失） |
| **mpsc** | Multi-Producer Single-Consumer | Ch-21 | Tokio 的多生产者单消费者通道，用于任务间消息传递 |

## N-O

| 英文术语 | 中文翻译 | 首次出现 | 说明 |
|---------|---------|---------|------|
| **Namespace Package** | 命名空间包 | Ch-09 | Python 的包组织方式，允许多个目录共享同一包名，Hermes 的 `tools/` 目录使用此机制 |
| **Newtype** | 新类型模式 | Ch-20 | Rust 模式：用单字段结构体包装类型以提供类型安全，如 `struct SessionId(String)` |
| **Oneshot** | 一次性通道 | Ch-21 | Tokio 的一次性通道，用于异步任务间的单次消息传递 |
| **Ownership** | 所有权 | Ch-20 | Rust 核心概念：每个值有唯一所有者，离开作用域时自动清理，消除悬垂指针和内存泄漏 |

## P

| 英文术语 | 中文翻译 | 首次出现 | 说明 |
|---------|---------|---------|------|
| **Platform Adapter** | 平台适配器 | Ch-14 | Gateway 中对接不同消息平台的模块，Hermes 支持 20 个平台（Telegram、Discord、飞书等） |
| **Prompt** | 提示词 | Ch-05 | 发送给 LLM 的输入文本，包括 system prompt（系统提示）和 user prompt（用户提示） |
| **PTY** | Pseudo-Terminal | Ch-10 | 伪终端，用于运行交互式命令（如 `vim`），Hermes 的 `terminal` 工具支持 pty 模式 |

## R

| 英文术语 | 中文翻译 | 首次出现 | 说明 |
|---------|---------|---------|------|
| **Rate Limit** | 速率限制 | Ch-03 | API Provider 对请求频率的限制，Hermes 通过 `jittered_backoff` 实现指数退避 |
| **Ratatui** | Ratatui | Ch-15 | Rust 的终端 UI 库（基于 tui-rs），Hermes Rust 版本用于替代 Python 的 `prompt_toolkit` |
| **Repo Map** | 仓库地图 | Ch-02 | 项目代码结构的紧凑表示，用于注入 LLM 上下文，Hermes 当前缺失（P-06-05） |
| **Result** | Result 类型 | Ch-20 | Rust 的错误处理类型 `Result<T, E>`，强制显式处理错误 |

## S

| 英文术语 | 中文翻译 | 首次出现 | 说明 |
|---------|---------|---------|------|
| **Sandbox** | 沙箱 | Ch-27 | 隔离执行环境，防止恶意代码破坏系统，Hermes Rust 版本集成 Landlock/Seatbelt |
| **Schema** | Schema（模式） | Ch-09 | 工具的参数定义，通常用 JSON Schema 格式，发送给 LLM 以生成工具调用 |
| **Seatbelt** | Seatbelt | Ch-27 | macOS 的沙箱框架（libsandbox），通过 `sandbox-exec` 命令或 C API 调用 |
| **select!** | select! 宏 | Ch-21 | Tokio 的异步多路复用宏，同时等待多个 Future，先完成的优先处理 |
| **Semaphore** | 信号量 | Ch-21 | 并发控制原语，限制同时访问资源的任务数，Tokio 提供 `tokio::sync::Semaphore` |
| **Session** | 会话 | Ch-08 | 一次完整的对话过程，Hermes 将会话转录持久化到 SQLite |
| **Skill** | 技能 | Ch-16 | Learning Loop 的核心：Agent 从经验中提炼的可复用知识，存储在 `~/.hermes/skills/` 目录 |
| **State Machine** | 状态机 | Ch-22 | 用明确的状态和转换规则组织控制流，Rust 版本用 `enum AgentState` 实现显式状态机 |
| **Stream** | 流 | Ch-21 | 异步生成一系列值的类型，Rust 的 `Stream` trait 类似 `Iterator` 但支持异步 |
| **Struct** | 结构体 | Ch-20 | Rust 的复合数据类型，类似 C 的 struct，可携带字段和方法 |

## T

| 英文术语 | 中文翻译 | 首次出现 | 说明 |
|---------|---------|---------|------|
| **Threshold** | 阈值 | Ch-06 | 触发上下文压缩的 Token 数阈值，不同 Provider 有不同系数（OpenRouter 0.85、Anthropic 0.75） |
| **Tiktoken** | Tiktoken | Ch-04 | OpenAI 的 Token 计数库，用于精确计算文本的 Token 数（Hermes 当前用 ~4 chars/token 估算，P-04-02） |
| **Tokio** | Tokio | Ch-21 | Rust 的异步运行时，提供任务调度、网络 I/O、定时器等基础设施 |
| **Tool Handler** | 工具处理器 | Ch-09 | 实现具体工具逻辑的类，Rust 版本通过 `trait ToolHandler` 定义统一接口 |
| **Trait** | Trait（特征） | Ch-20 | Rust 的接口机制，定义类型必须实现的方法集合，类似其他语言的 interface |
| **TUI** | Terminal User Interface | Ch-15 | 终端用户界面，比纯文本 CLI 更丰富，支持光标移动、颜色、布局（如 `top`、`htop`） |

## W

| 英文术语 | 中文翻译 | 首次出现 | 说明 |
|---------|---------|---------|------|
| **WAL** | Write-Ahead Log | Ch-08 | SQLite 的日志模式，支持并发读写，Hermes 用于 session 数据库 |
| **Watchdog** | 看门狗 | Ch-10 | 监控长时间运行任务并在超时后强制终止的机制，Hermes 的 `terminal` 工具有 timeout 参数 |
| **Workspace** | 工作空间 | Ch-19 | Cargo 的多包项目管理功能，Hermes Rust 版本用 workspace 组织 14 个 crate |

---

## 按首次出现章节分类

### 核心概念（Ch-01 - Ch-05）
Agent Loop, API Key, Auto-Memory, CLI, LLM, Prompt, Injection, Cache Control

### 工具与执行（Ch-09 - Ch-12）
Approval, Bash, CDP, Delegation, Inventory, MCP, PTY, Sandbox, Schema, Tool Handler, Watchdog

### 架构与性能（Ch-06 - Ch-08, Ch-13 - Ch-17）
Backpressure, Compression, Context Window, DashMap, Failover, FTS5, Gateway, Idempotency, LRU, Rate Limit, Session, Threshold, WAL

### Rust 相关（Ch-19 - Ch-22）
Builder Pattern, Channel, Crate, Derive Macro, Docker, Drop, Enum, Extension Trait, JoinSet, Landlock, Memory Fencing, mpsc, Namespace Package, Newtype, Oneshot, Ownership, Ratatui, Result, Seatbelt, select!, Semaphore, State Machine, Stream, Struct, Tiktoken, Tokio, Trait, TUI, Workspace

---

## 高频术语 TOP 10

根据全书出现频率统计（粗略估计）：

1. **Agent Loop**（出现 120+ 次）— 核心循环概念
2. **LLM**（出现 100+ 次）— 系统基础
3. **Tool**（出现 90+ 次）— 能力扩展机制
4. **Provider**（出现 80+ 次）— 多模型支持
5. **Prompt**（出现 70+ 次）— 提示工程核心
6. **State Machine**（出现 60+ 次）— 控制流设计
7. **Session**（出现 55+ 次）— 会话持久化
8. **MCP**（出现 50+ 次）— 协议集成
9. **Sandbox**（出现 45+ 次）— 安全沙箱
10. **Trait**（出现 40+ 次）— Rust 抽象机制

---

## 缩写与全称对照

| 缩写 | 全称 | 中文 |
|-----|------|------|
| **ABC** | Abstract Base Class | 抽象基类 |
| **ABI** | Application Binary Interface | 应用二进制接口 |
| **API** | Application Programming Interface | 应用程序接口 |
| **CDP** | Chrome DevTools Protocol | Chrome 开发者工具协议 |
| **CLI** | Command-Line Interface | 命令行界面 |
| **DAG** | Directed Acyclic Graph | 有向无环图 |
| **FTS** | Full-Text Search | 全文搜索 |
| **JSON** | JavaScript Object Notation | JavaScript 对象表示法 |
| **LLM** | Large Language Model | 大语言模型 |
| **LRU** | Least Recently Used | 最近最少使用 |
| **LSM** | Linux Security Module | Linux 安全模块 |
| **MCP** | Model Context Protocol | 模型上下文协议 |
| **PTY** | Pseudo-Terminal | 伪终端 |
| **RPC** | Remote Procedure Call | 远程过程调用 |
| **SDK** | Software Development Kit | 软件开发工具包 |
| **SSE** | Server-Sent Events | 服务器发送事件 |
| **TUI** | Terminal User Interface | 终端用户界面 |
| **WAL** | Write-Ahead Log | 预写日志 |

---

## 阅读建议

- **新手**：先掌握 Agent Loop、LLM、Tool、Prompt 等基础概念
- **Python 开发者**：重点理解 Rust 相关术语（Trait、Ownership、Enum、Result）
- **架构师**：关注 Gateway、MCP、Delegation、State Machine 等架构术语
- **安全研究者**：深入 Sandbox、Landlock、Seatbelt、Injection 相关术语
