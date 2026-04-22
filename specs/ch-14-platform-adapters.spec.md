# Ch-14: 平台适配器

## Meta
- **Design Bet:** Run Anywhere（跨平台覆盖）
- **Volume:** 上卷/解构
- **Part:** 第四篇：平台与交互
- **Word Budget:** 5,000 - 7,000
- **Opening Question:** 9 个消息平台有 9 种 API 风格，如何用统一的适配器模式消化差异？

## Intent

本章逐一分析 9 大平台适配器的共性与差异，揭示代码重复和 WhatsApp Node.js 桥接的问题。

## Decisions

- 叙事结构: 先共性模式提取，再选 3-4 个代表性适配器深入，最后 WhatsApp 桥接
- 重点适配器: Telegram、Discord、WhatsApp（代表性最强）

## Acceptance Criteria

场景: 平台覆盖
  假设 读者了解即时通讯平台
  当 读完本章
  那么 读者能列出 9 大平台（Telegram/Discord/Slack/WhatsApp/Signal/钉钉/飞书/QQ/Home Assistant）

场景: 代码重复
  假设 读者关注代码质量
  当 阅读共性分析部分
  那么 读者能识别适配器间的重复模式（消息解析、错误处理、重连逻辑）

场景: WhatsApp 桥接
  假设 读者关注部署复杂度
  当 阅读 WhatsApp 部分
  那么 读者能解释 Node.js 桥接的必要性和复杂度

场景: 消息格式
  假设 读者想新增平台
  当 阅读格式差异部分
  那么 读者能理解各平台消息格式差异的处理方式

## Core Source Files

| File | Lines | What to Analyze |
|------|-------|-----------------|
| `gateway/platforms/` | all | 9 大平台适配器 |

## Required Diagrams

1. 9 大平台适配器共性/差异对比矩阵

## Content Boundaries

### In Scope
- 9 大平台适配器逐一分析、共性模式提取
- WhatsApp Node.js 桥接、消息格式差异

### Forbidden
- 不要以平台列表开头（以"如何消化差异"问题切入）
- 不要重复 Ch-13 的网关核心内容

### Out of Scope
- 网关核心架构 → Ch-13
- CLI/TUI → Ch-15

## Problem IDs

- P-14-01 [Arch/High] 适配器代码大量重复
- P-14-02 [Rel/Medium] 错误处理不一致
- P-14-03 [Arch/Medium] WhatsApp 依赖 Node.js

## Quality Gates

- [ ] 至少 3 个平台有深入代码分析
- [ ] 重复代码模式有跨适配器对比
- [ ] WhatsApp 桥接有架构分析
- [ ] 章末总结回扣 Run Anywhere 赌注
- [ ] Acceptance criteria 场景全部满足
