# Ch-04: LLM 通信层

## Meta
- **Design Bet:** Run Anywhere（多 Provider 支撑多环境部署）
- **Volume:** 上卷/解构
- **Part:** 第一篇：架构基础
- **Word Budget:** 4,000 - 6,000
- **Opening Question:** 如何用一套代码同时对接 OpenRouter、Anthropic、OpenAI、Mistral 等不同 API？

## Intent

本章分析 Hermes 如何用一套代码对接多个 LLM Provider。重点揭示当前 if/elif 分支处理的局限性，以及 Token 估算硬编码对中文场景的影响，为下卷的 trait 抽象重写奠定基础。

## Decisions

- 叙事结构: 先 Transport 抽象设计意图，再暴露 if/elif 现状，最后 Token 估算问题
- 对比: 展示 if/elif 和 trait 抽象两种方式的差异

## Acceptance Criteria

场景: Transport 抽象
  假设 读者了解 HTTP API 调用
  当 读完本章
  那么 读者能说出 Transport 抽象的设计意图和当前 if/elif 实现的局限

场景: Token 估算偏差
  假设 读者的使用场景包含中文
  当 阅读 Token 估算部分
  那么 读者能解释 `CHARS_PER_TOKEN = 3` 硬编码对中文 Token 估算的影响（偏差 2-3 倍）

场景: 缓存生命周期
  假设 读者关注性能优化
  当 阅读提示词缓存部分
  那么 读者能追踪提示词缓存的生命周期和失效条件

场景: 用量追踪
  假设 读者关注成本控制
  当 阅读 API 用量部分
  那么 读者能理解 API 用量追踪机制

## Core Source Files

| File | Lines | What to Analyze |
|------|-------|-----------------|
| `agent/transports/` | all | Transport 抽象层 |
| `agent/model_metadata.py` | all | Token 估算、模型元数据 |
| `agent/prompt_caching.py` | all | 提示词缓存机制 |
| `agent/account_usage.py` | all | API 用量追踪 |

## Required Diagrams

1. 多 Provider 通信架构图（if/elif 分支可视化）

## Content Boundaries

### In Scope
- Transport 抽象
- 多 Provider 支持及 if/elif 现状
- Token 估算机制
- 提示词缓存
- API 用量追踪

### Forbidden
- 不要以 transport 目录文件列表开头
- 不要深入提示词组装（属于 Ch-05）

### Out of Scope
- 提示词组装 → Ch-05
- 上下文压缩 → Ch-06
- 流式响应处理 → Ch-03

## Problem IDs

- P-04-01 [Arch/High] Provider 切换 if/elif 分支，新增 Provider 需修改核心代码
- P-04-02 [Perf/High] `CHARS_PER_TOKEN = 3` 硬编码，中文偏差 2-3 倍
- P-04-03 [Perf/Medium] 缓存失效边界不清

## Quality Gates

- [ ] if/elif 分支有具体代码引用
- [ ] Token 估算偏差有中英文对比分析
- [ ] 缓存机制有完整生命周期描述
- [ ] 章末总结回扣 Run Anywhere 赌注
- [ ] Acceptance criteria 场景全部满足
