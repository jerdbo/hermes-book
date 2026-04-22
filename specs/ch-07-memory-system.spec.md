# Ch-07: 记忆系统

## Meta
- **Design Bet:** Personal Long-Term（跨会话记忆核心）、Learning Loop（记忆驱动学习）
- **Volume:** 上卷/解构
- **Part:** 第二篇：核心引擎
- **Word Budget:** 4,000 - 6,000
- **Opening Question:** 如何让 AI Agent 跨会话记住用户偏好，同时防止记忆被恶意注入？

## Intent

本章分析跨会话记忆的存储、检索与更新机制。重点是 Provider 模型的灵活性（内置 + 外部）和上下文围栏的安全设计。

## Decisions

- 叙事结构: 先从"记住用户"的产品需求切入，再分析架构，最后安全
- 安全重点: 上下文围栏（XML 标签 + 系统注释）

## Acceptance Criteria

场景: 架构模型
  假设 读者了解 Provider 模式
  当 读完本章
  那么 读者能说出记忆架构：始终内置 Provider + 至多一个外部 Provider

场景: 上下文围栏
  假设 读者关注记忆注入防护
  当 阅读安全部分
  那么 读者能解释上下文围栏（XML 标签 + 系统注释）的设计

场景: 工具路由
  假设 读者想扩展记忆系统
  当 阅读工具路由部分
  那么 读者能追踪路由逻辑：单 Provider 对应单工具，先注册者赢

场景: 生命周期钩子
  假设 读者想理解记忆更新时机
  当 阅读生命周期部分
  那么 读者能列出 5 个钩子的触发时机

场景: 清洗不对称
  假设 读者关注安全边界
  当 阅读清洗部分
  那么 读者能理解清洗不对称：注入有围栏但 on_memory_write 看到原始内容

## Core Source Files

| File | Lines | What to Analyze |
|------|-------|-----------------|
| `agent/memory_manager.py` | all (~374) | 记忆管理器全貌 |

## Required Diagrams

1. 记忆 Provider 生命周期图（注册 → 预取 → 使用 → 清洗 → 持久化）

## Content Boundaries

### In Scope
- 记忆管理器架构
- Provider 模型（内置 + 外部）
- 上下文围栏
- 工具路由
- 生命周期钩子
- Honcho 辩证建模
- 记忆清洗与去重

### Forbidden
- 不要以 memory_manager.py 类定义开头
- 不要深入 SQLite 存储实现

### Out of Scope
- SQLite 存储实现 → Ch-08
- 技能系统 → Ch-16

## Problem IDs

- P-07-01 [Perf/Medium] `prefetch_all()` 逐个 Provider 串行阻塞
- P-07-02 [Rel/Medium] 工具名冲突静默拒绝
- P-07-03 [Sec/Low] 清洗不对称：`on_memory_write` 看到原始内容
- P-07-04 [Rel/Low] 钩子异常被吞

## Quality Gates

- [ ] Provider 架构有代码证据
- [ ] 上下文围栏实现有 XML 标签示例
- [ ] 工具路由冲突行为有代码引用
- [ ] 5 个生命周期钩子各有触发条件
- [ ] 章末总结回扣 Personal Long-Term 赌注
- [ ] Acceptance criteria 场景全部满足
