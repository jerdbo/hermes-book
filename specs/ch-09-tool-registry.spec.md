# Ch-09: 工具注册与分发

## Meta
- **Design Bet:** Learning Loop（工具是 Agent 能力的载体）
- **Volume:** 上卷/解构
- **Part:** 第三篇：工具与执行
- **Word Budget:** 4,000 - 6,000
- **Opening Question:** 如何让 64+ 工具在启动时自注册，同时支持运行时动态添加 MCP 工具？

## Intent

本章分析工具注册与分发机制。Hermes 用 import 时自注册模式管理 64+ 工具，用 RLock + 快照模式保证线程安全。重点揭示手写 JSON Schema 和 Schema 膨胀的问题。

## Decisions

- 叙事结构: 先自注册流程，再线程安全，最后工具集与分发
- 代码重点: registry.py 的自注册模式和 RLock 快照

## Acceptance Criteria

场景: 自注册流程
  假设 读者了解 Python import 机制
  当 读完本章
  那么 读者能追踪自注册流程：import → registry.register() → model_tools.py 触发发现

场景: 线程安全
  假设 读者关注并发安全
  当 阅读线程安全部分
  那么 读者能解释 RLock 线程安全和快照模式的设计意图

场景: MCP 动态注册
  假设 读者想扩展工具
  当 阅读 MCP 注册部分
  那么 读者能理解 MCP 工具动态注册/注销的机制

场景: 工具集分组
  假设 读者想理解工具管理
  当 阅读工具集部分
  那么 读者能说出工具集系统（toolsets/distributions）的分组逻辑

场景: 异常包装
  假设 读者关注可靠性
  当 阅读分发部分
  那么 读者能解释 dispatch() 永不抛异常的设计和 JSON 错误包装

## Core Source Files

| File | Lines | What to Analyze |
|------|-------|-----------------|
| `tools/registry.py` | all | 自注册模式、RLock、快照 |
| `tools/model_tools.py` | all | 工具发现、get_tool_definitions() |
| `tools/toolsets.py` | all | 工具集分组 |
| `tools/toolset_distributions.py` | all | 工具集分发策略 |

## Required Diagrams

1. 工具注册与分发流程图

## Content Boundaries

### In Scope
- 自注册模式
- 线程安全（RLock + 快照）
- MCP 工具动态注册
- 工具集系统
- 分发与异常包装

### Forbidden
- 不要以 registry.py 类结构开头
- 不要深入具体工具实现

### Out of Scope
- 具体工具实现（文件/Web/浏览器） → Ch-11
- 终端工具与审批 → Ch-10
- MCP 协议细节 → Ch-12

## Problem IDs

- P-09-01 [Arch/Medium] 手写 JSON Schema
- P-09-02 [Rel/Medium] check_fn 异常静默吞掉
- P-09-03 [Rel/Low] 无工具版本管理
- P-09-04 [Perf/Low] 64+ 工具 Schema 膨胀

## Quality Gates

- [ ] 自注册流程有完整代码链路
- [ ] RLock 和快照模式有具体代码引用
- [ ] dispatch 异常包装逻辑有代码证据
- [ ] 章末总结回扣 Learning Loop 赌注
- [ ] Acceptance criteria 场景全部满足
