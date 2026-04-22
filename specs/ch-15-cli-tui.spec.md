# Ch-15: CLI 与 TUI

## Meta
- **Design Bet:** CLI-First（终端体验是第一优先级）
- **Volume:** 上卷/解构
- **Part:** 第四篇：平台与交互
- **Word Budget:** 5,000 - 7,000
- **Opening Question:** 为什么 Hermes 同时维护 Python prompt_toolkit CLI 和 React Ink TUI 两套终端实现？

## Intent

本章解读交互式终端界面的双实现架构。Hermes 同时维护 prompt_toolkit CLI 和 React Ink TUI，导致严重的逻辑重复。本章分析两套实现的各自特点和重叠之处。

## Decisions

- 叙事结构: 先 CLI 实现，再 TUI 实现，最后对比重叠分析
- 代码重点: cli.py ~23K 行的职责分析

## Acceptance Criteria

场景: CLI REPL
  假设 读者了解 REPL 概念
  当 读完本章
  那么 读者能追踪 HermesCLI 的 REPL 流程（prompt_toolkit）

场景: 斜杠命令
  假设 读者想自定义命令
  当 阅读命令注册部分
  那么 读者能说出斜杠命令的注册与自动补全机制

场景: TUI 架构
  假设 读者想了解 TUI 实现
  当 阅读 React Ink 部分
  那么 读者能解释 JSON-RPC 后端架构

场景: 重复分析
  假设 读者关注架构问题
  当 阅读对比部分
  那么 读者能理解为什么两套实现导致逻辑重复

场景: 皮肤引擎
  假设 读者想自定义外观
  当 阅读皮肤部分
  那么 读者能理解皮肤引擎的设计

## Core Source Files

| File | Lines | What to Analyze |
|------|-------|-----------------|
| `cli.py` | all (~23,000) | HermesCLI 主实现 |
| `hermes_cli/commands.py` | all | 斜杠命令注册 |
| `ui-tui/` | all | React Ink TUI |
| `tui_gateway/` | all | TUI JSON-RPC 后端 |
| `hermes_cli/skin_engine.py` | all | 皮肤引擎 |

## Required Diagrams

1. CLI vs TUI 双实现架构对比图

## Content Boundaries

### In Scope
- HermesCLI 实现、斜杠命令系统
- React Ink TUI、JSON-RPC 后端、皮肤引擎

### Forbidden
- 不要以 cli.py 文件结构开头（以"为什么两套实现"问题切入）
- 不要重复 Ch-03 的 Agent Loop 内容

### Out of Scope
- 网关 → Ch-13
- Agent Loop → Ch-03
- 工具分发 → Ch-09

## Problem IDs

- P-15-01 [Arch/Critical] cli.py 23K 行单文件
- P-15-02 [Arch/High] CLI 与 TUI 逻辑重复
- P-15-03 [Arch/Medium] TUI 依赖 Node.js

## Quality Gates

- [ ] CLI REPL 流程有代码追踪
- [ ] 两套实现的重复点有具体对比
- [ ] cli.py 巨型文件的职责分析充分
- [ ] 章末总结回扣 CLI-First 赌注
- [ ] Acceptance criteria 场景全部满足
