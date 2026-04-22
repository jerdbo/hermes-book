# Ch-21: 异步运行时与并发模型

## Meta
- **Design Bet:** Run Anywhere（高效并发支撑多平台服务）
- **Volume:** 下卷/重铸
- **Part:** 第六篇：Rust 基础设施
- **Word Budget:** 5,000 - 7,000
- **Opening Question:** 如何用 tokio 统一 Python 版中 asyncio + threading 混合的并发模型？

## Intent
本章用 tokio 统一 Python 版的混合并发模型。重点是 JoinSet 并行工具执行、mpsc channel 消息传递、select! 结构化并发、DashMap 并发容器。

## Decisions
- 叙事结构: 先 Python 并发问题，再 tokio 解决方案，每种原语配示例
- 代码要求: 所有 Rust 示例必须可编译

## Acceptance Criteria
场景: tokio 运行时
  假设 读者了解 async/await
  当 读完本章
  那么 读者能配置 tokio 多线程运行时

场景: 并行工具
  假设 读者想并行执行工具
  当 阅读 JoinSet 部分
  那么 读者能用 JoinSet 并行执行多个工具

场景: 消息传递
  假设 读者想实现网关通信
  当 阅读 channel 部分
  那么 读者能用 mpsc channel 实现网关消息传递

场景: 结构化并发
  假设 读者关注优雅关闭
  当 阅读 select 部分
  那么 读者能用 select! 和 graceful shutdown 实现结构化并发

场景: 并发容器
  假设 读者需要并发数据结构
  当 阅读 DashMap 部分
  那么 读者能用 DashMap 替代 threading.Lock + dict

## Core Source Files
| File | Lines | What to Analyze |
|------|-------|-----------------|
| `run_agent.py` | `_run_async()` | sync/async 桥接问题 |
| `agent/memory_manager.py` | `prefetch_all()` | 串行阻塞 |
| `gateway/run.py` | 并发部分 | 线程模型 |

## Required Diagrams
1. Python(asyncio+threading) vs Rust(tokio) 并发模型对比图
2. tokio 任务编排示意图（JoinSet/select!/channel）

## Content Boundaries
### In Scope
- tokio 运行时设计、JoinSet、mpsc channel、select!、graceful shutdown、DashMap、背压与流控
### Forbidden
- 不要写成 tokio 入门教程
### Out of Scope
- Agent Loop 具体实现 → Ch-22
- 网关具体实现 → Ch-30

## Fix Targets
P-07-01, P-08-01, P-10-05, P-13-03

## Quality Gates
- [ ] Python sync/async 桥接有具体代码对比
- [ ] 每种并发原语有可编译 Rust 示例
- [ ] 背压/流控有设计分析
- [ ] 章末总结回扣 Run Anywhere 赌注
- [ ] Acceptance criteria 场景全部满足
