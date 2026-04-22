# Ch-19: 项目脚手架与 Workspace 设计

## Meta
- **Design Bet:** Run Anywhere（模块化支撑多环境编译）
- **Volume:** 下卷/重铸
- **Part:** 第六篇：Rust 基础设施
- **Word Budget:** 5,000 - 7,000
- **Opening Question:** 如何将 50,000 行 Python 的功能合理拆分到 14 个 Rust crate 中？

## Intent
本章设计 14 crate 的 Cargo workspace 架构。重点是依赖 DAG 设计、每个 crate 的职责边界、hermes-sandbox 新增 crate 的设计动机，以及配置兼容策略。

## Decisions
- 叙事结构: 先 Python → Rust 模块映射，再 DAG 设计，最后配置兼容和技术选型
- 配置兼容: 保留 YAML 格式，零迁移成本

## Acceptance Criteria
场景: 依赖 DAG
  假设 读者了解 Cargo workspace
  当 读完本章
  那么 读者能画出 14 crate 的依赖 DAG

场景: crate 职责
  假设 读者想理解模块边界
  当 阅读 crate 职责部分
  那么 读者能解释每个 crate 的单一职责和公共接口

场景: sandbox 动机
  假设 读者关注安全
  当 阅读 hermes-sandbox 部分
  那么 读者能理解新增 crate 存在的原因（修复 P-10-01）

场景: 配置兼容
  假设 读者是现有 Python 版用户
  当 阅读配置部分
  那么 读者能说出配置兼容策略（保留 YAML 格式，零迁移成本）

场景: 技术选型
  假设 读者想理解选型理由
  当 阅读技术栈部分
  那么 读者能列出技术栈选型表并理解每项选型理由

## Core Source Files
| File | Lines | What to Analyze |
|------|-------|-----------------|
| 无 Python 源码 | - | 本章设计 Rust 项目结构 |

## Required Diagrams
1. 14 crate 依赖 DAG
2. crate 与 Python 模块的对应关系图

## Content Boundaries
### In Scope
- Cargo workspace 架构、14 crate 职责与接口、hermes-sandbox 设计动机
- 依赖 DAG、配置兼容策略、技术栈选型表
### Forbidden
- 不要深入具体 crate 实现代码
### Out of Scope
- 具体 crate 实现 → Ch-22 to Ch-33
- 错误处理详细设计 → Ch-20
- 异步运行时详细设计 → Ch-21

## Fix Targets
P-01-01, P-01-02, P-01-03, P-01-04, P-02-01, P-02-02, P-02-03, P-02-04

## Quality Gates
- [ ] 14 crate 依赖 DAG 正确且无循环
- [ ] 每个 crate 有明确的公共接口定义
- [ ] 技术栈每项有选型理由
- [ ] 配置兼容策略有具体示例
- [ ] 章末总结回扣 Run Anywhere 赌注
- [ ] Acceptance criteria 场景全部满足
