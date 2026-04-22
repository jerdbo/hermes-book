# Ch-32: CLI 与 TUI 重写

## Meta
- **Design Bet:** CLI-First（终端体验统一为 ratatui 单实现）
- **Volume:** 下卷/重铸
- **Part:** 第九篇：平台与交互重写
- **Word Budget:** 5,000 - 7,000
- **Opening Question:** 如何用 ratatui 统一 Python 版两套终端实现（prompt_toolkit CLI + React Ink TUI）？

## Intent
本章用 ratatui 统一终端界面，消灭双实现和 Node.js 依赖。重点是 clap CLI、ratatui TUI、斜杠命令统一注册中心。

## Decisions
- 叙事结构: 先 CLI(clap)，再 TUI(ratatui)，最后统一命令中心和主题
- 统一重点: 一套命令注册，CLI 和网关共享

## Acceptance Criteria
场景: clap CLI
  假设 读者了解命令行解析
  当 读完本章
  那么 读者能用 clap derive 宏实现声明式 CLI 参数解析

场景: ratatui TUI
  假设 读者想构建终端 UI
  当 阅读 TUI 部分
  那么 读者能用 ratatui + crossterm 实现全功能 TUI

场景: 命令中心
  假设 读者关注代码复用
  当 阅读命令部分
  那么 读者能实现斜杠命令统一注册中心（CLI 和网关共享）

场景: 主题系统
  假设 读者想自定义外观
  当 阅读主题部分
  那么 读者能实现主题系统

## Core Source Files
| File | Lines | What to Analyze |
|------|-------|-----------------|
| `cli.py` | all | Python CLI 对照 |
| `hermes_cli/commands.py` | all | Python 命令注册对照 |
| `hermes_cli/skin_engine.py` | all | Python 皮肤引擎对照 |

## Required Diagrams
1. Rust 统一终端架构图（clap CLI + ratatui TUI，共享命令中心）

## Content Boundaries
### In Scope
- clap CLI、ratatui + crossterm TUI、斜杠命令统一注册、主题系统
### Forbidden
- 不要重复 Ch-15 的 Python 分析
### Out of Scope
- 网关 → Ch-30
- 适配器 → Ch-31

## Fix Targets
P-15-01, P-15-02, P-15-03

## Quality Gates
- [ ] clap derive 宏有完整示例
- [ ] ratatui 有可编译的 UI 组件代码
- [ ] 命令注册中心有设计和代码
- [ ] 修复确认表覆盖 P-15-01/02/03
- [ ] 章末总结回扣 CLI-First 赌注
- [ ] Acceptance criteria 场景全部满足
