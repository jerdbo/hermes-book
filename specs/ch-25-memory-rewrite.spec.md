# Ch-25: 记忆与会话存储重写

## Meta
- **Design Bet:** Personal Long-Term（记忆是长期关系的基础）
- **Volume:** 下卷/重铸
- **Part:** 第七篇：核心引擎重写
- **Word Budget:** 5,000 - 7,000
- **Opening Question:** 如何用 Rust 的 trait 系统统一记忆存储和 SQLite 会话管理？

## Intent
本章重构记忆系统和 SQLite 存储。用 MemoryStore trait 统一 SQLite/文件双后端，用 rusqlite(bundled) 实现零外部依赖，引入数据迁移框架和并行预取。

## Decisions
- 叙事结构: 先 MemoryStore trait 设计，再 SQLite 实现，最后迁移和预取
- 存储选型: rusqlite bundled（SQLite 编译进二进制）

## Acceptance Criteria
场景: MemoryStore trait
  假设 读者了解 trait 设计
  当 读完本章
  那么 读者能实现 MemoryStore trait 并分别实现 SQLite 和文件后端

场景: rusqlite
  假设 读者关注零依赖部署
  当 阅读 SQLite 部分
  那么 读者能用 rusqlite(bundled) 做零外部依赖的 SQLite 集成

场景: FTS5
  假设 读者需要全文搜索
  当 阅读搜索部分
  那么 读者能保留 FTS5 全文搜索

场景: 迁移框架
  假设 读者关注数据演进
  当 阅读迁移部分
  那么 读者能实现数据迁移框架

场景: 并行预取
  假设 读者关注性能
  当 阅读预取部分
  那么 读者能用 futures::future::join_all 替代串行预取

## Core Source Files
| File | Lines | What to Analyze |
|------|-------|-----------------|
| `agent/memory_manager.py` | all | Python 记忆管理器对照 |
| `hermes_state.py` | all | Python SessionDB 对照 |

## Required Diagrams
1. MemoryStore trait 多后端架构图

## Content Boundaries
### In Scope
- MemoryStore trait + 双后端、rusqlite bundled、FTS5、连接池、数据迁移、并行预取、记忆围栏
### Forbidden
- 不要重复 Ch-07/Ch-08 的 Python 分析
### Out of Scope
- Agent Loop → Ch-22
- 上下文压缩 → Ch-24

## Fix Targets
P-07-01, P-07-02, P-07-03, P-07-04, P-08-01, P-08-02, P-08-03

## Quality Gates
- [ ] MemoryStore trait 有完整定义
- [ ] rusqlite bundled 配置有 Cargo.toml 示例
- [ ] 数据迁移框架有设计和代码
- [ ] 修复确认表覆盖所有 Fix Targets
- [ ] 章末总结回扣 Personal Long-Term 赌注
- [ ] Acceptance criteria 场景全部满足
