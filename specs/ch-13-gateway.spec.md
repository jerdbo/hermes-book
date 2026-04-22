# Ch-13: 消息网关架构

## Meta
- **Design Bet:** Run Anywhere（多平台统一入口）
- **Volume:** 上卷/解构
- **Part:** 第四篇：平台与交互
- **Word Budget:** 4,000 - 6,000
- **Opening Question:** 如何用一个网关同时服务 Telegram、Discord、Slack 等 9 个平台的消息？

## Intent

本章分析消息网关的设计，重点是 LRU 缓存的会话丢失风险和消息投递语义缺失。

## Decisions

- 叙事结构: 先网关全景，再 Agent 缓存，最后投递和钩子
- 性能重点: LRU 128 的驱逐策略和状态泄漏

## Acceptance Criteria

场景: 消息分发
  假设 读者了解消息队列概念
  当 读完本章
  那么 读者能追踪 GatewayRunner 的消息分发流程

场景: LRU 驱逐
  假设 读者关注高并发场景
  当 阅读缓存部分
  那么 读者能解释 LRU 缓存（128 个 AIAgent，1 小时驱逐）的设计及会话丢失风险

场景: 投递语义
  假设 读者关注消息可靠性
  当 阅读投递部分
  那么 读者能理解消息投递协调机制和钩子系统

场景: SSL 检测
  假设 读者关注部署
  当 阅读 SSL 部分
  那么 读者能解释 SSL 证书自动检测的优先级链

## Core Source Files

| File | Lines | What to Analyze |
|------|-------|-----------------|
| `gateway/run.py` | all | GatewayRunner、LRU 缓存 |
| `gateway/session.py` | all | 会话存储 |
| `gateway/delivery.py` | all | 消息投递 |
| `gateway/hooks.py` | all | 钩子系统 |
| `gateway/pairing.py` | all | 配对审批 |

## Required Diagrams

1. 网关消息分发架构图（平台 → 网关 → Agent 实例池）

## Content Boundaries

### In Scope
- GatewayRunner 设计、Agent 缓存与驱逐、会话存储
- 消息投递、钩子系统、配对审批、SSL 证书检测

### Forbidden
- 不要以 gateway/ 目录结构开头
- 不要深入各平台适配器实现

### Out of Scope
- 各平台适配器细节 → Ch-14
- CLI/TUI → Ch-15
- 终端审批机制 → Ch-10

## Problem IDs

- P-13-01 [Rel/High] LRU 驱逐导致会话丢失
- P-13-02 [Rel/Medium] 无 at-least-once 投递语义
- P-13-03 [Rel/Medium] Agent 复用状态泄漏
- P-13-04 [Arch/Low] 配置桥接静默失败

## Quality Gates

- [ ] LRU 缓存参数有代码引用
- [ ] 会话丢失场景有具体分析
- [ ] SSL 优先级链有代码证据
- [ ] 章末总结回扣 Run Anywhere 赌注
- [ ] Acceptance criteria 场景全部满足
