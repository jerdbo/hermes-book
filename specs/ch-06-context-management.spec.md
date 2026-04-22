# Ch-06: 上下文管理

## Meta
- **Design Bet:** Personal Long-Term（长对话需要有效的上下文管理）
- **Volume:** 上卷/解构
- **Part:** 第二篇：核心引擎
- **Word Budget:** 6,000 - 8,000
- **Opening Question:** 当对话超过模型上下文窗口时，如何在保留关键信息的同时压缩对话历史？

## Intent

本章深度解读上下文压缩策略。Hermes 使用三层保护（头部/尾部/中间段）和工具结果预处理来管理上下文窗口，但存在阈值硬编码、缺少微压缩等问题。

## Decisions

- 叙事结构: 先展示上下文溢出的问题场景，再分析三层保护，最后预处理和摘要
- 代码重点: context_compressor.py ~1200 行

## Acceptance Criteria

场景: 三层保护
  假设 读者理解 LLM 上下文窗口概念
  当 读完本章
  那么 读者能画出三层保护策略：头部（系统提示 + 前 3 条消息）、尾部（最近 20% Token）、中间段压缩

场景: 预处理模式
  假设 读者关注无 LLM 调用的优化
  当 阅读工具结果预处理部分
  那么 读者能解释三种预处理模式（终端输出、文件读取、MD5 去重）

场景: 摘要隔离
  假设 读者关注安全
  当 阅读 LLM 摘要部分
  那么 读者能理解摘要隔离机制（`[CONTEXT COMPACTION - REFERENCE ONLY]` 前缀）的安全意义

场景: 防抖策略
  假设 读者关注性能
  当 阅读防抖部分
  那么 读者能解释反复压缩防抖策略（连续两次节省 <10% 则跳过）

场景: 摘要模板
  假设 读者想了解摘要质量
  当 阅读摘要部分
  那么 读者能说出结构化模板（Resolved/Pending/Remaining Work）

## Core Source Files

| File | Lines | What to Analyze |
|------|-------|-----------------|
| `agent/context_compressor.py` | all (~1200) | 三层压缩、预处理、摘要 |
| `agent/auxiliary_client.py` | all | 辅助 LLM 客户端 |
| `tools/tool_result_storage.py` | all | Token 预算控制 |

## Required Diagrams

1. 三层压缩策略架构图（头部/中间/尾部）
2. 压缩决策流程图（预处理 → 全量压缩 → 防抖检查）

## Content Boundaries

### In Scope
- 上下文压缩器完整分析
- 三层保护策略
- 工具结果预处理
- LLM 摘要模板与隔离
- 反复压缩防抖
- Token 预算控制

### Forbidden
- 不要以 context_compressor.py 类结构开头
- 不要使用伪代码替代真实源码

### Out of Scope
- 提示词组装 → Ch-05
- 记忆系统 → Ch-07
- 会话分裂 → Ch-08

## Problem IDs

- P-06-01 [Perf/High] 阈值硬编码不自适应（50%/20%/5%）
- P-06-02 [Perf/High] 缺少微压缩（只有全量压缩）
- P-06-03 [Rel/Medium] 压缩信息丢失无反馈
- P-06-04 [Perf/Medium] 去重仅基于 MD5（无语义去重）
- P-06-05 [Perf/Low] 缺少 Repo Map

## Quality Gates

- [ ] 三层保护策略的阈值有代码引用
- [ ] 预处理三种模式各有代码示例
- [ ] 摘要隔离前缀的具体实现有引用
- [ ] 防抖策略条件有代码证据
- [ ] 章末总结回扣 Personal Long-Term 赌注
- [ ] Acceptance criteria 场景全部满足
