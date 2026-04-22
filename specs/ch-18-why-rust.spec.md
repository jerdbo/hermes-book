# Ch-18: 为什么用 Rust 重写

## Meta
- **Design Bet:** 全部四个（Rust 重写是四个赌注的工程升级）
- **Volume:** 下卷/重铸
- **Part:** 第六篇：Rust 基础设施
- **Word Budget:** 4,000 - 6,000
- **Opening Question:** Python AI Agent 的天花板在哪里？Rust 能带来什么系统级的突破？

## Intent
本章论证 Rust 重写的必要性。先分析 Python 的四个天花板（GIL、sync/async 桥接、运行时类型、部署复杂），再对应 Rust 的系统级优势，用实测数据支撑论证。

## Decisions
- 叙事结构: Python 天花板 → Rust 优势 → 实测数据 → 问题消灭矩阵
- 数据要求: 50K Python → ~5K Rust、100+ 文件 → 14 crate 等必须有来源

## Acceptance Criteria
场景: Python 天花板
  假设 读者有 Python 开发经验
  当 读完本章
  那么 读者能列出四个天花板（GIL、sync/async 桥接、运行时类型、部署复杂）

场景: Rust 优势
  假设 读者了解 Rust 基础概念
  当 阅读 Rust 优势部分
  那么 读者能对应说出四个系统级优势（零成本抽象、所有权、编译时安全、单二进制）

场景: 实测数据
  假设 读者需要量化证据
  当 阅读对比数据部分
  那么 读者能理解实测数据：50K Python → ~5K Rust、100+ 文件 → 14 crate

场景: 问题消灭
  假设 读者想知道重写价值
  当 阅读消灭矩阵部分
  那么 读者能查阅哪些问题被 Rust 语言本身消灭

## Core Source Files
| File | Lines | What to Analyze |
|------|-------|-----------------|
| `run_agent.py` | `_run_async()` 区域 | sync/async 桥接地狱 |
| `pyproject.toml` | all | 依赖链复杂度 |

## Required Diagrams
1. Python vs Rust 对比矩阵图
2. 问题消灭分类图（语言级/生态级/设计级）

## Content Boundaries
### In Scope
- Python 天花板分析、Rust 系统级优势、实测对比数据、问题消灭矩阵
### Forbidden
- 不要写成 Rust 入门教程
- 不要在没有数据支撑的情况下做性能断言
### Out of Scope
- Rust 语言教程 → 前置知识
- 具体 crate 设计 → Ch-19

## Fix Targets
回顾上卷所有问题的分类，不直接修复。

## Quality Gates
- [ ] Python 天花板每项有代码证据
- [ ] 对比数据有具体来源
- [ ] 问题消灭矩阵覆盖所有 P-XX-XX
- [ ] 章末总结回扣四个设计赌注
- [ ] Acceptance criteria 场景全部满足
