# Ch-16: 技能与插件系统

## Meta
- **Design Bet:** Learning Loop（自改进能力核心）
- **Volume:** 上卷/解构
- **Part:** 第四篇：平台与交互
- **Word Budget:** 4,000 - 6,000
- **Opening Question:** 如何让 AI Agent 从完成的任务中自动提炼可复用技能，并通过插件扩展自身能力？

## Intent

本章分析自改进技能系统和插件扩展机制。技能系统是 Learning Loop 赌注的核心体现，让 Agent 能从任务中学习。

## Decisions

- 叙事结构: 先技能格式和生命周期，再插件发现，最后安全分析
- 学习重点: 技能如何从任务中自动生成

## Acceptance Criteria

场景: 技能格式
  假设 读者想创建自定义技能
  当 读完本章
  那么 读者能说出技能格式（YAML + Markdown）和内置/可选技能的区分

场景: 技能 CRUD
  假设 读者想管理技能
  当 阅读 CRUD 部分
  那么 读者能追踪技能 CRUD 流程

场景: Skills Hub
  假设 读者想共享技能
  当 阅读 Hub 部分
  那么 读者能解释 Skills Hub 集成机制

场景: 插件发现
  假设 读者想开发插件
  当 阅读插件部分
  那么 读者能理解插件发现机制（namespace packages）

场景: 安全隐患
  假设 读者关注安全
  当 阅读安全部分
  那么 读者能识别技能内容注入系统提示的安全隐患

## Core Source Files

| File | Lines | What to Analyze |
|------|-------|-----------------|
| `skills/` | overview | 26 类内置技能 |
| `optional-skills/` | overview | 可选技能 |
| `agent/skill_commands.py` | all | 技能 CRUD |
| `hermes_cli/plugins.py` | all | 插件发现 |
| `plugins/context_engine/` | all | 上下文引擎插件 |

## Required Diagrams

1. 技能系统生命周期图（发现 → 加载 → 注入 → 执行 → 学习 → 存储）

## Content Boundaries

### In Scope
- 技能格式和分类、技能 CRUD、Skills Hub
- 插件发现、上下文引擎插件

### Forbidden
- 不要以 skills/ 目录列表开头
- 不要重复 Ch-05 的提示注入内容

### Out of Scope
- 技能提示注入细节 → Ch-05
- 记忆系统 → Ch-07

## Problem IDs

- P-16-01 [Perf/Medium] 每次会话扫描整个技能目录
- P-16-02 [Rel/Medium] 插件 API 无版本管理
- P-16-03 [Sec/Low] 技能内容无沙箱

## Quality Gates

- [ ] 技能格式有示例文件引用
- [ ] CRUD 流程有代码追踪
- [ ] 插件 namespace packages 有代码引用
- [ ] 章末总结回扣 Learning Loop 赌注
- [ ] Acceptance criteria 场景全部满足
