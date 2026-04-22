# Ch-30: 消息网关重写

## Meta
- **Design Bet:** Run Anywhere（高并发多平台服务）
- **Volume:** 下卷/重铸
- **Part:** 第九篇：平台与交互重写
- **Word Budget:** 5,000 - 7,000
- **Opening Question:** 如何用 DashMap + TTL 驱逐 + at-least-once 投递语义重构网关？

## Intent
本章重构网关并发模型和会话管理。用 DashMap 替代 LRU、oneshot channel 替代轮询、at-least-once + 幂等键去重保证投递。

## Decisions
- 叙事结构: 先会话管理，再异步审批，最后投递保证和钩子
- 并发选型: DashMap + TTL + SQLite 持久化

## Acceptance Criteria
场景: DashMap 会话
  假设 读者了解 Ch-21 的并发容器
  当 读完本章
  那么 读者能用 DashMap 实现并发 HashMap + TTL 驱逐（驱逐前持久化到 SQLite）

场景: 异步审批
  假设 读者了解 Ch-10 的审批问题
  当 阅读审批部分
  那么 读者能用 oneshot::channel 替代 threading.Event.wait 轮询

场景: 投递保证
  假设 读者关注消息可靠性
  当 阅读投递部分
  那么 读者能实现 at-least-once + 幂等键去重

场景: 类型安全钩子
  假设 读者想扩展网关
  当 阅读钩子部分
  那么 读者能实现类型安全的事件订阅

## Core Source Files
| File | Lines | What to Analyze |
|------|-------|-----------------|
| `gateway/run.py` | all | Python 网关对照 |
| `gateway/session.py` | all | Python 会话对照 |
| `gateway/delivery.py` | all | Python 投递对照 |

## Required Diagrams
1. Rust 网关并发架构图（DashMap + channel + 投递队列）

## Content Boundaries
### In Scope
- DashMap 会话管理 + TTL、oneshot 异步审批、at-least-once + 幂等去重、类型安全钩子
### Forbidden
- 不要重复 Ch-13 的 Python 分析
### Out of Scope
- 平台适配器 → Ch-31
- CLI/TUI → Ch-32

## Fix Targets
P-13-01, P-13-02, P-13-03, P-13-04

## Quality Gates
- [ ] DashMap + TTL 有完整实现
- [ ] oneshot 审批有 Python 轮询对比
- [ ] 投递保证有幂等键设计
- [ ] 修复确认表覆盖 P-13-01/02/03
- [ ] 章末总结回扣 Run Anywhere 赌注
- [ ] Acceptance criteria 场景全部满足
