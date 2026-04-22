# Ch-22: Agent Loop 重写

## Meta
- **Design Bet:** 全部四个（Agent Loop 是执行引擎）
- **Volume:** 下卷/重铸
- **Part:** 第七篇：核心引擎重写
- **Word Budget:** 8,000 - 10,000
- **Opening Question:** 如何将 Python 23K 行的隐式状态机重写为 Rust 的显式状态机？

## Intent
本章是下卷的核心章节。用显式状态机重写 Agent 对话循环，定义四个核心 Trait（LlmClient、ToolHandler、TerminalBackend、PlatformAdapter），建立类型安全的消息历史。

## Decisions
- 叙事结构: 先状态机设计，再四个 Trait，最后消息历史和流式响应
- 代码要求: 所有 Trait 定义必须完整可编译
- 状态机: Idle → Thinking → ToolCall → Responding → Done

## Acceptance Criteria
场景: AgentLoop trait
  假设 读者了解 Rust trait
  当 读完本章
  那么 读者能实现 AgentLoop trait 并理解其可测试、可组合的设计

场景: 状态机枚举
  假设 读者了解 Ch-20 的枚举建模
  当 阅读状态机部分
  那么 读者能用枚举建模：Idle → Thinking → ToolCall → Responding → Done

场景: 四个核心 Trait
  假设 读者想理解系统抽象
  当 阅读 Trait 定义部分
  那么 读者能写出四个核心 Trait（LlmClient、ToolHandler、TerminalBackend、PlatformAdapter）的完整定义

场景: 消息历史
  假设 读者关注类型安全
  当 阅读消息部分
  那么 读者能理解 Vec<Message> + Content 枚举的类型安全消息历史

场景: 迭代预算
  假设 读者关注执行边界
  当 阅读预算部分
  那么 读者能实现迭代预算的编译时保证

## Core Source Files
| File | Lines | What to Analyze |
|------|-------|-----------------|
| `run_agent.py` | 416+, 800-1200, 8786-end | Python Agent Loop 对照 |

## Required Diagrams
1. Rust Agent 状态机转换图
2. 四个核心 Trait 的关系图

## Content Boundaries
### In Scope
- AgentLoop trait、状态机枚举、四个核心 Trait 完整定义
- Vec<Message> + Content 枚举、Stream<Item = Delta>
- 优雅中断与恢复、迭代预算编译时保证
### Forbidden
- 不要省略 Trait 定义的任何字段（必须完整）
### Out of Scope
- LLM Provider 实现 → Ch-23
- 提示组装 → Ch-24
- 记忆存储 → Ch-25

## Fix Targets
P-03-01, P-03-02, P-03-03, P-03-04, P-03-05

## Quality Gates
- [ ] 四个核心 Trait 有完整可编译定义
- [ ] 状态机有编译期保证不可能非法转换
- [ ] Grace call 语义在新实现中有明确定义
- [ ] 修复确认表覆盖 P-03-01/02/03
- [ ] 章末总结回扣四个设计赌注
- [ ] Acceptance criteria 场景全部满足
