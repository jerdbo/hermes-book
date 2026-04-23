# 附录 B：流程图汇总

> 快速定位全书 34 章中的关键 Mermaid 图表。

本附录索引了全书所有重要的 Mermaid 流程图、状态机图、架构图和矩阵图，按章节顺序排列。每个图表都标注了类型（架构图 / 流程图 / 状态机 / 矩阵）和核心说明，方便读者快速定位和参考。

---

## 如何使用本附录

1. **按章节浏览**：如果你记得某个图在哪一章，直接查找对应章节
2. **按类型筛选**：通过"类型"列快速找到所有状态机图或架构图
3. **按关键词搜索**：用 Ctrl+F 搜索关键词（如"Provider"、"沙箱"、"MCP"）

---

## 图表索引

| 章节 | 图表名称 | 类型 | 核心说明 |
|-----|---------|------|---------|
| **Ch-01** | 四个设计赌注关系图 | 架构图 | 展示 Learning Loop、CLI-First、Personal Long-Term、Run Anywhere 四个设计赌注与章节映射关系 |
| **Ch-01** | 技术栈全景图 | 架构图 | Python Runtime、Node.js Runtime、Storage 三层架构，展示双运行时依赖 |
| **Ch-02** | 仓库目录树 | 结构图 | 项目根目录的文件与目录结构，标注行数和职责 |
| **Ch-03** | 端到端请求流程 | 流程图 | 从用户输入到最终响应的完整路径，包含 Agent Loop、工具执行、错误恢复 |
| **Ch-03** | Agent Loop 状态机 | 状态机 | 10+ 个状态转换和退出条件，包括 Grace Call、预算耗尽、中断等路径 |
| **Ch-03** | 错误分类管道 | 流程图 | 7 阶段错误分类优先级管道，从特定模式到通用 fallback |
| **Ch-04** | Provider 路由架构 | 架构图 | ProviderTransport ABC 和 4 个具体实现（Chat Completions、Anthropic、Codex、Bedrock） |
| **Ch-04** | api_mode 路由决策树 | 决策树 | 9 级 fallback 逻辑，从显式指定到默认 chat_completions |
| **Ch-05** | 系统提示组装流程 | 流程图 | 8 层注入架构：身份 → 工具引导 → 模型调优 → 外部提示 → 记忆 → 技能 → 上下文 → 环境 |
| **Ch-05** | 提示注入检测流程 | 流程图 | 不可见字符检测 + 10 条威胁模式匹配，返回 BLOCKED 标记 |
| **Ch-06** | 压缩决策流程 | 流程图 | 4 种触发条件（Provider 返回、Token 超阈值、插件强制、重试失败）+ 双模式压缩 |
| **Ch-06** | 阈值计算矩阵 | 矩阵图 | 不同 Provider 的阈值系数（OpenRouter 0.85、Anthropic 0.75、Bedrock 0.80） |
| **Ch-07** | 记忆系统生命周期 | 流程图 | MEMORY.md 和 USER.md 的加载 → 注入 → 更新 → 持久化完整流程 |
| **Ch-07** | 外部记忆 Provider 集成 | 架构图 | MemoryManager 统一接口，对接 Honcho / Holographic 等插件 |
| **Ch-08** | Session 持久化架构 | 架构图 | SQLite schema、异步写入队列、WAL 模式 |
| **Ch-08** | 迁移检测流程 | 流程图 | schema_version 检测 → 自动 migration 或警告 |
| **Ch-09** | 工具注册表架构 | 架构图 | inventory 自动发现 + 手动注册双路径 |
| **Ch-10** | 终端工具执行流程 | 流程图 | 黑名单检测 → Smart Approval → Bash/Python/interactive 三路径 |
| **Ch-10** | Smart Approval 非确定性分支 | 决策树 | 不同 LLM 对同一命令的批准结果差异示例 |
| **Ch-11** | 文件/Web/Browser 工具能力矩阵 | 矩阵图 | read_file、search_files、web_search、browser_action 等工具的输入输出和依赖 |
| **Ch-12** | MCP 双传输架构 | 架构图 | stdio（子进程管道）vs HTTP（StreamableHTTP + OAuth） |
| **Ch-12** | MCP 委派层级图 | 层级图 | Parent Agent → Delegation → Child Agent，预算独立传递 |
| **Ch-12** | 代码执行沙箱流程 | 流程图 | execute_code 工具的代码注入、环境隔离、超时控制 |
| **Ch-13** | Gateway 消息分发架构 | 架构图 | GatewayRunner → Platform Adapters → AIAgent 缓存池 |
| **Ch-13** | LRU 驱逐策略 | 流程图 | 128 并发上限 + 1 小时空闲超时，驱逐时会话丢失风险 |
| **Ch-14** | 20 个平台对比矩阵 | 矩阵图 | Telegram、Discord、Slack、飞书、企业微信等平台的认证方式、消息格式、媒体支持 |
| **Ch-14** | 平台适配器代码重复分析 | 矩阵图 | 认证逻辑、媒体上传、错误处理三维度的重复率 |
| **Ch-15** | CLI vs TUI 架构对比 | 对比图 | HermesCLI（prompt_toolkit）vs 潜在 ratatui 方案 |
| **Ch-15** | 455 行 if/elif 命令解析树 | 决策树 | 主命令、子命令、参数的解析逻辑（未来用 clap 替代） |
| **Ch-16** | 技能生命周期 | 流程图 | 创建 → 索引 → 加载 → 使用 → 更新 → 归档完整流程 |
| **Ch-16** | 技能索引缓存策略 | 流程图 | 进程内 LRU + 磁盘快照 JSONL 双层缓存，manifest checksum 校验 |
| **Ch-17** | 问题分布四维矩阵 | 热力图 | 严重程度（Critical/High/Medium/Low）× 维度（Arch/Perf/Rel/Sec）交叉分布 |
| **Ch-17** | 问题依赖 DAG | 依赖图 | 根因层（P-03-01、P-15-01）→ 架构传播层 → 性能/安全/可靠性放大层 |
| **Ch-17** | Rust 重写收益分布 | 饼图 | 语言级消灭 47% + 生态改善 29% + 设计层重构 24% |
| **Ch-17** | 下卷路线图 | 甘特图 | 四阶段（拆弹行动 → 核心重构 → 生态增强 → 性能优化），每阶段的章节和里程碑 |
| **Ch-18** | Python vs Rust 对比矩阵 | 对比图 | 巨型单文件 vs 模块化强制、无沙箱 vs Landlock、双运行时 vs 统一 Tokio |
| **Ch-18** | 问题消灭分类 | 矩阵图 | 65 个问题按"语言级 / 生态 / 设计"三类收益的分布 |
| **Ch-19** | 14 Crate 依赖 DAG | 依赖图 | L1 基础层（hermes-core）→ L6 应用层（hermes-agent、hermes-cli），强制单向依赖 |
| **Ch-19** | Python → Rust 模块映射 | 映射表 | run_agent.py → hermes-agent/hermes-core，cli.py → hermes-cli 等 12 个映射关系 |
| **Ch-20** | Rust 类型系统安全保证 | 架构图 | Message、Content、AgentState、Error 的类型层级和所有权规则 |
| **Ch-21** | 异步并发模型对比 | 对比图 | Python asyncio vs Rust Tokio，单线程 vs 多线程调度 |
| **Ch-21** | Tokio 任务编排示例 | 流程图 | spawn、select!、timeout、JoinSet 的典型组合 |
| **Ch-22** | Rust Agent 状态机枚举 | 状态机 | Idle → Thinking → ToolCall/Responding → Done，编译期穷尽性检查 |
| **Ch-22** | 状态转换 Trait 关系 | 架构图 | StateMachine trait + 每个状态的 handle 方法 |
| **Ch-23** | LLM Provider Trait 体系 | 架构图 | trait Provider + AnthropicProvider、OpenAIProvider 等具体实现 |
| **Ch-24** | 提示与上下文管理 | 流程图 | Tera 模板引擎 + 动态上下文注入 + Prompt Caching 集成 |
| **Ch-25** | 记忆系统重写 | 架构图 | trait MemoryStore + File/SQLite/Plugin 实现，异步并发预取 |
| **Ch-26** | 工具注册与调度 | 架构图 | trait ToolHandler + 动态注册表 + 并发执行池 |
| **Ch-27** | 三级沙箱架构 | 层级图 | L1 内核沙箱（Landlock/Seatbelt）→ L2 进程隔离（Docker）→ L3 权限控制（Approval） |
| **Ch-27** | 安全检测流水线 | 流程图 | 黑名单 → 语义分析 → Smart Approval → 沙箱执行 → 审计日志 |
| **Ch-28** | 文件/Web 工具重写 | 架构图 | 异步文件 I/O（tokio::fs）+ headless 浏览器（chromiumoxide） |
| **Ch-29** | MCP 协议重写 | 架构图 | 基于官方 mcp-rust crate，Token bucket 速率限制 |
| **Ch-30** | Gateway 与适配器重写 | 架构图 | Actor 模型（tokio::sync::mpsc）+ 持久化会话缓存 |
| **Ch-31** | CLI/TUI 重写 | 架构图 | clap derive macro + ratatui 纯 Rust TUI |
| **Ch-32** | 技能系统重写 | 架构图 | 异步目录扫描 + abi_stable ABI 稳定插件 |
| **Ch-33** | 跨平台适配器统一 | 架构图 | wasm-bindgen WebAssembly + 统一错误处理 |
| **Ch-34** | 性能优化雷达图 | 雷达图 | 内存占用、延迟、并发、启动时间、二进制体积 5 维度对比 |
| **Ch-34** | 问题修复状态矩阵 | 矩阵图 | 65 个问题的修复状态（已解决 / 部分解决 / 设计重构 / 遗留） |
| **Ch-34** | 架构演进路线图 | 路线图 | v1.0（Rust 基础）→ v1.5（插件生态）→ v2.0（WebAssembly）→ v3.0（GPU 推理） |

---

## 按类型分类索引

### 架构图（23 个）
- Ch-01: 四个设计赌注、技术栈全景
- Ch-04: Provider 路由架构
- Ch-07: 外部记忆 Provider 集成
- Ch-08: Session 持久化架构
- Ch-09: 工具注册表架构
- Ch-12: MCP 双传输、委派层级
- Ch-13: Gateway 消息分发
- Ch-19: 14 Crate 依赖 DAG
- Ch-20: Rust 类型系统
- Ch-22: 状态转换 Trait 关系
- Ch-23: LLM Provider Trait 体系
- Ch-25-34: 各子系统重写架构

### 流程图（18 个）
- Ch-03: 端到端请求、错误分类管道
- Ch-05: 系统提示组装、提示注入检测
- Ch-06: 压缩决策
- Ch-07: 记忆系统生命周期
- Ch-08: 迁移检测
- Ch-10: 终端工具执行
- Ch-12: 代码执行沙箱
- Ch-13: LRU 驱逐策略
- Ch-16: 技能生命周期、索引缓存
- Ch-21: Tokio 任务编排
- Ch-24-34: 各子系统实现流程

### 状态机（3 个）
- Ch-03: Agent Loop 状态机（Python 隐式）
- Ch-22: Rust Agent 状态机枚举（显式）
- Ch-27: 安全检测流水线状态机

### 矩阵 / 对比图（12 个）
- Ch-06: 阈值计算矩阵
- Ch-11: 文件/Web/Browser 工具能力矩阵
- Ch-14: 20 个平台对比、代码重复分析
- Ch-15: CLI vs TUI 架构对比
- Ch-17: 问题分布四维矩阵、Rust 收益分布
- Ch-18: Python vs Rust 对比、问题消灭分类
- Ch-34: 性能雷达图、问题修复状态

### 决策树 / 层级图（5 个）
- Ch-04: api_mode 路由决策树
- Ch-10: Smart Approval 非确定性分支
- Ch-15: 455 行 if/elif 命令解析树
- Ch-27: 三级沙箱架构
- Ch-34: 架构演进路线图

---

## 高频引用图表 TOP 5

根据全书其他章节的引用频率统计：

1. **Ch-03 Agent Loop 状态机**（被引用 8 次）— 理解 Hermes 核心循环的关键
2. **Ch-17 问题依赖 DAG**（被引用 6 次）— 重写优先级的决策基础
3. **Ch-19 14 Crate 依赖 DAG**（被引用 7 次）— Rust 架构的蓝图
4. **Ch-05 系统提示组装流程**（被引用 5 次）— Prompt Engineering 的实现细节
5. **Ch-22 Rust Agent 状态机枚举**（被引用 6 次）— 显式状态机的核心设计

---

## 阅读建议

- **架构师**：重点查看 Ch-01、Ch-04、Ch-19、Ch-22 的架构图
- **性能优化者**：关注 Ch-06、Ch-21、Ch-34 的流程图和雷达图
- **安全研究者**：详读 Ch-10、Ch-27 的沙箱架构和检测流水线
- **Rust 学习者**：对比 Ch-03 与 Ch-22 的状态机设计演进
