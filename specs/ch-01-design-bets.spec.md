# Ch-01: 设计赌注与竞争差异

## Meta
- **Design Bet:** 全部四个（本章是总纲）
- **Volume:** 上卷/解构
- **Part:** 第一篇：架构基础
- **Word Budget:** 5,000 - 7,000
- **Opening Question:** 当 Claude Code、Codex CLI、Goose 等 Agent 已经存在时，Hermes Agent 为什么还有价值？

## Intent

本章是全书总纲，从竞争格局和产品定位切入，帮助读者理解 Hermes Agent 的四个核心设计赌注。通过与 Claude Code 的定位对比（瑞士军刀 vs 精磨单刀），建立读者对项目价值和技术方向的认知框架。

## Decisions

- 叙事结构: 先竞品格局分析，再引出四个设计赌注，最后技术栈总览
- 对比基线: 以 Claude Code 为主要对比对象
- 数据来源: 代码规模数据必须从 pyproject.toml 和 package.json 中获取

## Acceptance Criteria

场景: 设计赌注认知
  假设 读者初次接触 Hermes Agent
  当 读完本章
  那么 读者能说出四个设计赌注的含义及其对应的产品能力

场景: 竞品定位对比
  假设 读者了解 Claude Code 基本功能
  当 阅读"竞争差异"部分
  那么 读者能区分 Hermes 与 Claude Code 的定位差异（瑞士军刀 vs 精磨单刀）

场景: 代码规模认知
  假设 读者需要理解项目复杂度
  当 阅读技术栈总览
  那么 读者能从代码规模数据（run_agent.py ~12K, cli.py ~11K, 全项目 ~258K Python + ~50K TypeScript）理解项目的工程挑战

场景: 双运行时风险
  假设 读者关注部署复杂度
  当 阅读技术栈部分
  那么 读者能理解双运行时依赖（Python + Node.js）的历史原因及带来的部署问题

场景: 章节导航
  假设 读者想按兴趣选择阅读路径
  当 阅读设计赌注映射表
  那么 读者能将每个设计赌注映射到后续具体章节

## Core Source Files

| File | Lines | What to Analyze |
|------|-------|-----------------|
| `run_agent.py` | 1-50 | AIAgent 类定义、核心依赖 import |
| `cli.py` | 1-50 | HermesCLI 入口 |
| `hermes_cli/config.py` | all | 配置系统总览 |
| `pyproject.toml` | all | 依赖列表、项目元数据 |
| `package.json` | all | Node.js 依赖（TUI、WhatsApp） |

## Required Diagrams

1. 四个设计赌注与章节映射关系图
2. 技术栈全景图（Python/Node.js/SQLite 组件关系）

## Content Boundaries

### In Scope
- 四个设计赌注深度分析
- 竞品定位对比（Claude Code 为主）
- 技术栈总览
- 代码规模分析

### Forbidden
- 不要以文件列表开头（以竞争格局切入）
- 不要深入具体模块实现细节

### Out of Scope
- 详细目录结构 → Ch-02
- Agent Loop 详解 → Ch-03
- 具体工具实现 → Ch-09 to Ch-12

## Problem IDs

- P-01-01 [Arch/High] 巨型单文件：run_agent.py 和 cli.py 各超万行
- P-01-02 [Arch/Medium] 双运行时依赖：Python + Node.js
- P-01-03 [Perf/Medium] 部署复杂：pip install + 50+ 依赖链
- P-01-04 [Perf/Low] 冷启动 3-5 秒，空载内存 200MB+

## Quality Gates

- [ ] 四个设计赌注均有独立段落分析
- [ ] 至少引用 3 个竞品进行定位对比
- [ ] 代码规模数据有 `filename:linenumber` 支撑
- [ ] 问题清单完整且与设计文档一致
- [ ] 章末总结回扣设计赌注
- [ ] Acceptance criteria 场景全部满足
