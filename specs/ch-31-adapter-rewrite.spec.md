# Ch-31: 平台适配器重写

## Meta
- **Design Bet:** Run Anywhere（跨平台统一抽象）
- **Volume:** 下卷/重铸
- **Part:** 第九篇：平台与交互重写
- **Word Budget:** 5,000 - 7,000
- **Opening Question:** 如何用 trait + 泛型消除 9 个适配器间的代码重复，并用纯 Rust 消灭 Node.js 依赖？

## Intent
本章用 PlatformAdapter trait 统一所有平台，用 extension trait 扩展平台特定功能，用纯 Rust WebSocket 消灭 WhatsApp 的 Node.js 依赖。

## Decisions
- 叙事结构: 先 trait 设计，再基础抽象，最后 WhatsApp 纯 Rust 方案
- 重点适配器: 至少完整实现 Telegram 和 Discord

## Acceptance Criteria
场景: PlatformAdapter trait
  假设 读者了解 Ch-22 的 Trait 定义
  当 读完本章
  那么 读者能实现 PlatformAdapter trait 统一所有平台

场景: 基础抽象
  假设 读者关注代码复用
  当 阅读抽象部分
  那么 读者能实现基础消息处理抽象（解析、错误处理、重连复用）

场景: extension trait
  假设 读者需要平台特定功能
  当 阅读扩展部分
  那么 读者能用 extension trait 实现平台特定功能

场景: WhatsApp Rust
  假设 读者关注消灭 Node.js 依赖
  当 阅读 WhatsApp 部分
  那么 读者能用纯 Rust WebSocket 替代 Node.js 桥接

## Core Source Files
| File | Lines | What to Analyze |
|------|-------|-----------------|
| `gateway/platforms/` | all | Python 适配器对照 |

## Required Diagrams
1. PlatformAdapter trait 层次图（基础 trait + extension trait）

## Content Boundaries
### In Scope
- PlatformAdapter trait、基础消息处理抽象、Extension trait、WhatsApp 纯 Rust
### Forbidden
- 不要重复 Ch-14 的 Python 分析
### Out of Scope
- 网关核心 → Ch-30
- CLI/TUI → Ch-32

## Fix Targets
P-14-01, P-14-02, P-14-03

## Quality Gates
- [ ] PlatformAdapter trait 与 Ch-22 定义一致
- [ ] 至少 2 个 adapter 有完整实现
- [ ] WhatsApp Rust 替代有可行性分析
- [ ] 修复确认表覆盖 P-14-01/02/03
- [ ] 章末总结回扣 Run Anywhere 赌注
- [ ] Acceptance criteria 场景全部满足
