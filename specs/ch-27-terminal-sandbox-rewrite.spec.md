# Ch-27: 终端执行引擎与沙箱重写

## Meta
- **Design Bet:** CLI-First（安全执行是 CLI 信任的基础）、Run Anywhere（多执行后端）
- **Volume:** 下卷/重铸
- **Part:** 第八篇：工具与执行重写
- **Word Budget:** 8,000 - 10,000
- **Opening Question:** 如何引入 Landlock/Seatbelt 系统级沙箱，将安全从应用层正则提升到内核层？

## Intent
本章引入系统级沙箱（hermes-sandbox crate），是下卷的安全核心。三级沙箱模式、Landlock(Linux)/Seatbelt(macOS)、确定性规则引擎、Drop 自动清理。

## Decisions
- 叙事结构: 先回顾 P-10-01 的严重性，再沙箱设计，最后规则引擎和审计
- 安全重点: 三级沙箱（read-only/workspace-write/full-access）

## Acceptance Criteria
场景: TerminalBackend trait
  假设 读者了解 Ch-22 的 Trait 定义
  当 读完本章
  那么 读者能实现 TerminalBackend trait 统一 Local + Docker 执行

场景: 本地执行
  假设 读者需要本地执行
  当 阅读本地执行部分
  那么 读者能用 tokio::process::Command + PTY 实现本地执行

场景: 三级沙箱
  假设 读者关注安全分级
  当 阅读沙箱部分
  那么 读者能实现三级沙箱（read-only/workspace-write/full-access）

场景: 平台适配
  假设 读者需要跨平台
  当 阅读平台部分
  那么 读者能实现 Linux Landlock 和 macOS Seatbelt 的平台适配

场景: 规则引擎
  假设 读者关注确定性
  当 阅读审批部分
  那么 读者能用确定性规则引擎替代 LLM Smart Approval

场景: 进程清理
  假设 读者关注资源泄漏
  当 阅读清理部分
  那么 读者能用 Drop trait 自动清理避免进程泄漏

## Core Source Files
| File | Lines | What to Analyze |
|------|-------|-----------------|
| `tools/terminal_tool.py` | all | Python 终端工具对照 |
| `tools/approval.py` | all | Python 审批对照 |
| `tools/environments/` | all | Python 执行后端对照 |

## Required Diagrams
1. 三级沙箱模型图
2. 命令执行安全流水线（规则引擎 → 沙箱 → 执行 → 审计）

## Content Boundaries
### In Scope
- TerminalBackend trait、tokio::process + PTY、Docker(bollard)
- hermes-sandbox(Landlock + Seatbelt)、三级沙箱、确定性规则引擎
- Drop 自动清理、审批审计日志
### Forbidden
- 不要弱化沙箱的重要性
### Out of Scope
- 工具注册 → Ch-26
- MCP 沙箱复用 → Ch-29

## Fix Targets
P-10-01, P-10-02, P-10-03, P-10-04, P-10-05, P-10-06, P-10-07

## Quality Gates
- [ ] Landlock 和 Seatbelt 各有平台特定代码
- [ ] 三级沙箱有配置和切换示例
- [ ] 确定性规则引擎有完整替代方案
- [ ] Drop 自动清理有测试
- [ ] 修复确认表覆盖全部 7 个 P-10-xx
- [ ] 章末总结回扣 CLI-First 和 Run Anywhere 赌注
- [ ] Acceptance criteria 场景全部满足
