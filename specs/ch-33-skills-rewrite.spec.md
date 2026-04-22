# Ch-33: 技能与插件系统重写

## Meta
- **Design Bet:** Learning Loop（自改进能力核心升级）
- **Volume:** 下卷/重铸
- **Part:** 第九篇：平台与交互重写
- **Word Budget:** 4,000 - 6,000
- **Opening Question:** 如何让技能加载从每次全量扫描变为增量缓存 + 懒加载？

## Intent
本章重构技能加载和插件 API。重点是懒加载 + 增量缓存、版本化 trait 的插件 API、技能内容安全扫描。

## Decisions
- 叙事结构: 先技能加载优化，再插件系统重构，最后安全扫描
- 插件选型: 讨论 libloading vs WASM 权衡

## Acceptance Criteria
场景: 懒加载
  假设 读者关注启动性能
  当 读完本章
  那么 读者能用 serde_yaml 实现技能解析 + 懒加载 + 增量缓存

场景: 插件选型
  假设 读者想理解插件架构
  当 阅读插件部分
  那么 读者能理解动态库（libloading）或 WASM 插件的选型权衡

场景: 版本化 API
  假设 读者关注向后兼容
  当 阅读 API 部分
  那么 读者能实现版本化 trait 的插件 API

场景: 安全扫描
  假设 读者关注技能安全
  当 阅读安全部分
  那么 读者能实现技能内容安全扫描

## Core Source Files
| File | Lines | What to Analyze |
|------|-------|-----------------|
| `agent/skill_commands.py` | all | Python 技能 CRUD 对照 |
| `hermes_cli/plugins.py` | all | Python 插件发现对照 |

## Required Diagrams
1. Rust 技能加载流水线图（发现 → 缓存检查 → 懒加载 → 安全扫描 → 注入）

## Content Boundaries
### In Scope
- serde_yaml 解析+懒加载+增量缓存、libloading/WASM 选型、版本化 trait、安全扫描
### Forbidden
- 不要重复 Ch-16 的 Python 分析
### Out of Scope
- 提示注入拦截 → Ch-24
- 记忆系统 → Ch-25

## Fix Targets
P-16-01, P-16-02, P-16-03

## Quality Gates
- [ ] 懒加载+增量缓存有性能对比
- [ ] 插件选型有 libloading vs WASM 权衡分析
- [ ] 版本化 trait 有向后兼容示例
- [ ] 修复确认表覆盖 P-16-01/02/03
- [ ] 章末总结回扣 Learning Loop 赌注
- [ ] Acceptance criteria 场景全部满足
