# Ch-03: 一次请求的旅程

## Meta
- **Design Bet:** 全部四个（Agent Loop 是所有赌注的执行引擎）
- **Volume:** 上卷/解构
- **Part:** 第一篇：架构基础
- **Word Budget:** 7,000 - 8,000
- **Opening Question:** 当用户输入"帮我写一个 Python 脚本"时，Hermes 内部发生了什么？

## Intent

本章是上卷的核心章节。先用一个完整请求的端到端追踪建立直觉，然后深入 Agent Loop 的 while 循环 + break 条件的隐式状态机，最后分析错误恢复机制。这是理解后续所有章节的基础。

## Decisions

- 叙事结构: 先端到端追踪（建立直觉），再深入 Agent Loop 核心，最后错误恢复
- 代码重点: run_agent.py 416+ 行的 AIAgent 类
- 状态机分析: 必须画出所有 break 条件的状态转换

## Acceptance Criteria

场景: 端到端追踪
  假设 读者了解基本 LLM API 调用
  当 读完本章 "端到端追踪" 部分
  那么 读者能追踪一条用户消息的完整链路：CLI 解析 → AIAgent 创建 → 系统提示组装 → LLM 调用 → 工具执行 → 结果回传 → 响应展示

场景: 隐式状态机
  假设 读者想理解 Agent Loop 控制流
  当 阅读 Agent Loop 部分
  那么 读者能画出 while 循环 + break 条件的隐式状态机

场景: 预算与 Grace call
  假设 读者关注执行边界
  当 阅读迭代预算部分
  那么 读者能解释 max_iterations=90、delegation.max_iterations=50 和 Grace call 机制

场景: 错误分类器性能
  假设 读者关注性能问题
  当 阅读错误恢复部分
  那么 读者能说出 100+ 正则错误分类器的工作方式及其性能问题

场景: 回调适配
  假设 读者想理解多场景复用
  当 阅读回调机制部分
  那么 读者能理解 10+ 回调如何让同一个 AIAgent 适配 CLI/Gateway/Batch 三种场景

## Core Source Files

| File | Lines | What to Analyze |
|------|-------|-----------------|
| `run_agent.py` | 416+, 800-1200 | AIAgent 类核心、对话循环 |
| `run_agent.py` | 8786-end | 流式响应、中断处理 |
| `agent/retry_utils.py` | all | 重试策略 |
| `agent/error_classifier.py` | all | 100+ 正则错误分类 |

## Required Diagrams

1. 端到端请求流程图（用户输入 → 响应展示）
2. Agent Loop 状态机图（while 循环 + break 条件）
3. 错误恢复决策树（重试/轮换/回退/压缩）

## Content Boundaries

### In Scope
- 端到端请求追踪
- AIAgent 类核心结构
- 对话循环（while + break 隐式状态机）
- 迭代预算与 Grace call
- /steer 命令注入
- 消息历史管理
- 流式响应处理
- 错误恢复与重试
- 回调机制

### Forbidden
- 不要以 run_agent.py 文件结构开头（以用户请求追踪切入）
- 不要使用伪代码（必须引用真实源码）

### Out of Scope
- LLM Provider 细节 → Ch-04
- 提示词组装细节 → Ch-05
- 上下文压缩细节 → Ch-06
- 工具分发细节 → Ch-09

## Problem IDs

- P-03-01 [Arch/Critical] 23K 行单文件：AIAgent 包含所有职责
- P-03-02 [Arch/High] 隐式状态机：while 循环 + break，无显式状态转换
- P-03-03 [Rel/High] Grace call 语义不清：工具调用在 grace call 中静默丢失
- P-03-04 [Perf/Medium] 100+ 正则顺序匹配，无缓存，无 Aho-Corasick
- P-03-05 [Rel/Medium] 不解析 Rate-Limit 头：退避策略盲猜

## Quality Gates

- [ ] 端到端链路每一步都有 `filename:linenumber`
- [ ] Agent Loop 状态转换分析覆盖所有 break 条件
- [ ] Grace call 边界行为有代码证据
- [ ] 错误分类器性能分析有具体正则数量和匹配方式
- [ ] 章末总结关联全部四个设计赌注
- [ ] Acceptance criteria 场景全部满足
