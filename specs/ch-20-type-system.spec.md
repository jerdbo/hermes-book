# Ch-20: 错误处理与类型系统设计

## Meta
- **Design Bet:** CLI-First（类型安全提升终端交互可靠性）
- **Volume:** 下卷/重铸
- **Part:** 第六篇：Rust 基础设施
- **Word Budget:** 4,000 - 6,000
- **Opening Question:** 如何用 Rust 的类型系统让"非法状态不可表达"，从编译期消灭整类 bug？

## Intent
本章用 Rust 类型系统从根源消灭 Python 版的类型安全问题。重点是分层错误体系、枚举状态机建模、Builder pattern 和 newtype pattern。

## Decisions
- 叙事结构: 先 Python 问题回顾，再 Rust 解决方案，每节 Python vs Rust 对比
- 代码要求: 所有 Rust 示例必须可编译

## Acceptance Criteria
场景: 错误体系
  假设 读者了解 Rust Result 类型
  当 读完本章
  那么 读者能用 thiserror 定义领域错误、用 anyhow 处理应用层

场景: 状态机
  假设 读者了解枚举
  当 阅读状态机部分
  那么 读者能用枚举建模 Agent 状态机并理解非法状态转换编译不过

场景: Builder pattern
  假设 读者了解 Python 可选参数
  当 阅读 Builder 部分
  那么 读者能用 Builder pattern 替代 Python 的可选参数

场景: newtype
  假设 读者关注参数安全
  当 阅读 newtype 部分
  那么 读者能用 newtype pattern（SessionId(String)）防止参数混用

## Core Source Files
| File | Lines | What to Analyze |
|------|-------|-----------------|
| `run_agent.py` | 状态相关代码 | Python 隐式状态的问题 |
| `agent/error_classifier.py` | all | Python 错误处理的问题 |

## Required Diagrams
1. Agent 状态机枚举转换图（Idle → Thinking → ToolCall → Responding → Done）

## Content Boundaries
### In Scope
- 分层错误体系、Result 全链路传播、枚举状态机、Builder pattern、newtype pattern
### Forbidden
- 不要写成 Rust 教程（假设读者了解基础）
### Out of Scope
- 具体 Agent Loop 实现 → Ch-22
- 异步运行时 → Ch-21

## Fix Targets
P-03-02, P-03-03, P-14-02

## Quality Gates
- [ ] 错误类型层次有完整 Rust 代码
- [ ] 状态机枚举有编译期保证的具体示例
- [ ] Builder 和 newtype 各有 Python vs Rust 对比
- [ ] 章末总结回扣 CLI-First 赌注
- [ ] Acceptance criteria 场景全部满足
