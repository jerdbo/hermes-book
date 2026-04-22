# Ch-02: 仓库地图与五层架构

## Meta
- **Design Bet:** Run Anywhere（配置灵活性支撑多环境部署）
- **Volume:** 上卷/解构
- **Part:** 第一篇：架构基础
- **Word Budget:** 4,000 - 6,000
- **Opening Question:** 面对 50,000 行代码和 100+ 文件，如何快速建立全局认知？

## Intent

本章为读者建立代码结构的空间感。通过五层架构模型（Entry → Orchestration → Capability → State → Platform）组织认知，然后深入配置系统的四层合并策略，让读者能定位任意功能的源码位置。

## Decisions

- 叙事结构: 先五层架构模型俯瞰，再入口追踪，最后配置系统
- 架构模型: 使用设计文档定义的五层模型，不自创分类
- 配置重点: 强调四层合并优先级和环境变量桥接

## Acceptance Criteria

场景: 架构模型
  假设 读者了解基本软件分层概念
  当 读完本章
  那么 读者能画出五层架构模型并说出每层包含哪些模块

场景: 入口追踪
  假设 读者想定位命令入口
  当 阅读入口追踪部分
  那么 读者能从 `hermes` 命令追踪到 `hermes_cli/main.py` → 命令分发

场景: 配置合并
  假设 读者需要理解配置来源
  当 阅读配置系统部分
  那么 读者能说出四层配置合并优先级（默认值 → 配置文件 → 环境变量 → CLI 参数）

场景: 桥接风险
  假设 读者关注配置安全
  当 阅读环境变量桥接部分
  那么 读者能理解桥接机制（config.yaml → os.environ）的设计意图和风险

场景: 快速定位
  假设 读者阅读后续章节时遇到不熟悉的模块
  当 回查本章仓库地图
  那么 读者能用仓库地图定位任意功能的源码位置

## Core Source Files

| File | Lines | What to Analyze |
|------|-------|-----------------|
| `hermes_cli/main.py` | all | 入口点、命令分发 |
| `hermes_cli/config.py` | all | 配置加载、合并、桥接 |
| `hermes_cli/__init__.py` | all | 包结构 |
| `.env.example` | all | 环境变量模板 |
| `config.yaml.example` | all | 配置文件模板 |

## Required Diagrams

1. 五层架构模型图（Entry → Orchestration → Capability → State → Platform）
2. 目录结构与模块关系图
3. 配置合并流程图

## Content Boundaries

### In Scope
- 五层架构模型
- 目录结构与模块关系
- 关键入口点追踪
- 配置系统全景
- 构建与运行环境搭建

### Forbidden
- 不要以目录列表开头（以"如何建立全局认知"问题切入）
- 不要深入 Agent Loop 实现

### Out of Scope
- Agent Loop 详细分析 → Ch-03
- 具体工具实现 → Ch-09+
- 技能系统细节 → Ch-16

## Problem IDs

- P-02-01 [Arch/Medium] 配置散落多处，无单一事实来源
- P-02-02 [Sec/High] API Key 明文存储在 .env
- P-02-03 [Rel/Medium] 配置验证静默失败：`except Exception: pass`
- P-02-04 [Rel/Low] 不支持配置热重载

## Quality Gates

- [ ] 五层架构图与设计文档定义一致
- [ ] 入口链路有完整 `filename:linenumber` 追踪
- [ ] 配置合并的四层优先级有代码证据
- [ ] 问题清单完整
- [ ] 章末总结回扣 Run Anywhere 赌注
- [ ] Acceptance criteria 场景全部满足
