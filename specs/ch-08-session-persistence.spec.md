# Ch-08: 会话持久化

## Meta
- **Design Bet:** Personal Long-Term（会话历史是长期记忆的基础）
- **Volume:** 上卷/解构
- **Part:** 第二篇：核心引擎
- **Word Budget:** 3,000 - 4,000
- **Opening Question:** 如何在 SQLite 中高效存储和检索 AI Agent 的对话历史？

## Intent

本章解读 SQLite 会话存储的设计。作为相对简单的章节，重点在 WAL 模式的并发特性、FTS5 全文搜索配置，以及父子会话链的设计。

## Decisions

- 叙事结构: 先表结构，再 WAL 并发，最后 FTS5 和会话链
- 篇幅控制: 本章较简单，控制在 3000-4000 字

## Acceptance Criteria

场景: 表结构
  假设 读者了解 SQLite 基础
  当 读完本章
  那么 读者能画出 SessionDB 的核心表结构

场景: WAL 并发
  假设 读者关注网关场景
  当 阅读 WAL 部分
  那么 读者能解释 WAL 模式的并发读写特性及写锁竞争问题

场景: FTS5
  假设 读者想理解搜索能力
  当 阅读全文搜索部分
  那么 读者能理解 FTS5 的配置和使用场景

场景: 会话分裂
  假设 读者关注长对话管理
  当 阅读父子会话部分
  那么 读者能追踪压缩触发的会话分裂链

## Core Source Files

| File | Lines | What to Analyze |
|------|-------|-----------------|
| `hermes_state.py` | all | SessionDB 设计、表结构、WAL、FTS5 |

## Required Diagrams

1. SessionDB 表关系图（会话、消息、元数据、FTS 索引）

## Content Boundaries

### In Scope
- SessionDB 设计
- SQLite WAL 模式
- FTS5 全文搜索
- 会话元数据
- 会话来源标记
- 父子会话链

### Forbidden
- 不要以 SQL DDL 语句开头
- 不要重复 Ch-07 的记忆管理器内容

### Out of Scope
- 记忆管理器 → Ch-07
- 上下文压缩 → Ch-06
- 网关会话管理 → Ch-13

## Problem IDs

- P-08-01 [Perf/High] SQLite 高并发写锁竞争
- P-08-02 [Rel/High] 无数据迁移框架
- P-08-03 [Rel/Medium] 连接管理粗放（无连接池）

## Quality Gates

- [ ] 表结构有 SQL 定义引用
- [ ] WAL 模式的并发限制有分析
- [ ] FTS5 配置有代码引用
- [ ] 章末总结回扣 Personal Long-Term 赌注
- [ ] Acceptance criteria 场景全部满足
