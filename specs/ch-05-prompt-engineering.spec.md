# Ch-05: 提示工程

## Meta
- **Design Bet:** Learning Loop（技能系统提示注入）、Personal Long-Term（记忆引导）
- **Volume:** 上卷/解构
- **Part:** 第二篇：核心引擎
- **Word Budget:** 5,000 - 7,000
- **Opening Question:** AI Agent 的系统提示是如何从一段静态文本变成包含身份、记忆、技能、环境信息的动态文档的？

## Intent

本章揭示系统提示词的动态组装流程。Hermes 的提示不是一段静态文本，而是由 6 层注入机制动态构建的复合文档。重点分析提示注入检测的"只 log 不拦截"安全隐患。

## Decisions

- 叙事结构: 先展示最终提示词的复杂度，再拆解 6 层注入，最后安全分析
- 安全重点: 18 条正则检测模式的覆盖范围和盲区

## Acceptance Criteria

场景: 6 层注入
  假设 读者了解 LLM 系统提示概念
  当 读完本章
  那么 读者能说出 6 层注入顺序：身份 → 平台提示 → 记忆引导 → 技能系统 → 上下文文件 → 环境信息

场景: 上下文文件扫描
  假设 读者想自定义 Agent 行为
  当 阅读上下文文件部分
  那么 读者能列出扫描范围（SOUL.md、AGENTS.md、.cursorrules、HERMES.md）

场景: 注入检测隐患
  假设 读者关注安全
  当 阅读注入检测部分
  那么 读者能解释 18 条正则的工作方式及其"只 log 不拦截"的安全隐患

场景: 缓存机制
  假设 读者关注性能
  当 阅读技能提示缓存部分
  那么 读者能理解 JSONL 快照 + checksum 校验的设计

场景: 模型差异
  假设 读者使用多种 LLM
  当 阅读模型调优部分
  那么 读者能说出模型特定调优差异（OpenAI 强制 tool_use、Google 并行执行引导）

## Core Source Files

| File | Lines | What to Analyze |
|------|-------|-----------------|
| `agent/prompt_builder.py` | all (~1050) | 6 层注入、上下文文件扫描、注入检测 |
| `agent/prompt_caching.py` | all | 技能提示缓存 |

## Required Diagrams

1. 6 层提示注入流程图

## Content Boundaries

### In Scope
- 系统提示组装流程
- 6 层注入机制
- 上下文文件扫描
- 提示注入检测（18 条正则）
- 技能系统提示缓存
- 模型特定调优

### Forbidden
- 不要以 prompt_builder.py 文件结构开头
- 不要深入上下文压缩（属于 Ch-06）

### Out of Scope
- 上下文压缩 → Ch-06
- 记忆系统内部 → Ch-07
- 技能 CRUD → Ch-16

## Problem IDs

- P-05-01 [Sec/High] 提示注入检测只 log 不拦截
- P-05-02 [Sec/Medium] 注入检测不完整：无法覆盖 Base64、代码注释混淆
- P-05-03 [Rel/Medium] 上下文文件大小不检查
- P-05-04 [Rel/Low] 身份冲突无警告

## Quality Gates

- [ ] 6 层注入每层都有代码引用
- [ ] 18 条正则模式有代表性示例
- [ ] 检测后不拦截的行为有具体代码证据
- [ ] 章末总结回扣 Learning Loop 和 Personal Long-Term 赌注
- [ ] Acceptance criteria 场景全部满足
