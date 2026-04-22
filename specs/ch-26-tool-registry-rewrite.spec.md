# Ch-26: 工具注册系统重写

## Meta
- **Design Bet:** Learning Loop（编译时安全的工具注册）
- **Volume:** 下卷/重铸
- **Part:** 第八篇：工具与执行重写
- **Word Budget:** 4,000 - 6,000
- **Opening Question:** 如何用 Rust 的 trait + derive 宏让工具注册从手写 JSON Schema 变为编译时自动生成？

## Intent
本章用 trait + derive 宏替代手写 JSON Schema 的自注册，用 inventory crate 实现编译时注册，用 schemars 自动生成 Schema。

## Decisions
- 叙事结构: 先 Python 手写 Schema 问题，再 Rust derive 宏方案
- 注册模式: inventory（编译时）+ RwLock<HashMap>（运行时 MCP）

## Acceptance Criteria
场景: ToolHandler trait
  假设 读者了解 Ch-22 的 Trait 定义
  当 读完本章
  那么 读者能用 ToolHandler trait + inventory crate 实现编译时自注册

场景: Schema 自动生成
  假设 读者厌倦手写 Schema
  当 阅读 schemars 部分
  那么 读者能用 schemars derive 自动生成工具 Schema

场景: 工具集
  假设 读者想管理工具分组
  当 阅读工具集部分
  那么 读者能用 EnumSet<ToolCategory> 替代字符串匹配

场景: 双模式注册
  假设 读者需要支持 MCP
  当 阅读 ToolRegistry 部分
  那么 读者能实现 RwLock<HashMap> 支持静态+动态注册

## Core Source Files
| File | Lines | What to Analyze |
|------|-------|-----------------|
| `tools/registry.py` | all | Python 注册对照 |
| `tools/model_tools.py` | all | Python 工具定义对照 |

## Required Diagrams
1. Rust 工具注册架构图（编译时 inventory + 运行时 MCP 动态注册）

## Content Boundaries
### In Scope
- ToolHandler trait + inventory、schemars Schema、EnumSet 工具集、ToolRegistry、按需工具加载
### Forbidden
- 不要重复 Ch-09 的 Python 分析
### Out of Scope
- 终端执行 → Ch-27
- MCP 工具 → Ch-29

## Fix Targets
P-09-01, P-09-02, P-09-03, P-09-04

## Quality Gates
- [ ] ToolHandler trait 与 Ch-22 定义一致
- [ ] inventory 注册有可编译示例
- [ ] schemars 自动生成有对比示例
- [ ] 修复确认表覆盖 P-09-01/02/04
- [ ] 章末总结回扣 Learning Loop 赌注
- [ ] Acceptance criteria 场景全部满足
