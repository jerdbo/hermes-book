# Ch-23: LLM Provider 层重写

## Meta
- **Design Bet:** Run Anywhere（多 Provider 统一接口）
- **Volume:** 下卷/重铸
- **Part:** 第七篇：核心引擎重写
- **Word Budget:** 5,000 - 7,000
- **Opening Question:** 如何用 Rust trait 消灭 Python 版中的 if/elif Provider 分支？

## Intent
本章用 LlmClient trait 统一多 Provider 接口，用 tiktoken-rs 替代硬编码 Token 估算，实现缓存装饰层和连接池。

## Decisions
- 叙事结构: 先 if/elif 问题回顾，再 trait 解决方案，最后精确 Token 计数
- Provider 实现: 至少展示 OpenRouter 和 Anthropic 两个完整实现

## Acceptance Criteria
场景: LlmClient trait
  假设 读者了解 Ch-22 的 Trait 定义
  当 读完本章
  那么 读者能实现 LlmClient trait 并为多个 Provider 写独立 struct

场景: 缓存装饰
  假设 读者关注性能
  当 阅读缓存部分
  那么 读者能实现 trait 级别的缓存装饰层

场景: 精确计数
  假设 读者关注中文 Token 精度
  当 阅读 Token 部分
  那么 读者能用 tiktoken-rs 替代 CHARS_PER_TOKEN = 3

场景: 连接池
  假设 读者关注高并发
  当 阅读连接部分
  那么 读者能实现连接池与速率限制

## Core Source Files
| File | Lines | What to Analyze |
|------|-------|-----------------|
| `agent/transports/` | all | Python Transport 对照 |
| `agent/model_metadata.py` | all | Token 估算对照 |

## Required Diagrams
1. LlmClient trait 多 Provider 实现架构图

## Content Boundaries
### In Scope
- LlmClient trait 定义与实现、多 Provider struct、缓存装饰层、tiktoken-rs、连接池/速率限制
### Forbidden
- 不要重复 Ch-22 的 Trait 定义
### Out of Scope
- Agent Loop → Ch-22
- 提示组装 → Ch-24

## Fix Targets
P-04-01, P-04-02, P-04-03

## Quality Gates
- [ ] LlmClient trait 与 Ch-22 定义一致
- [ ] 至少两个 Provider 有完整实现
- [ ] Token 计数有精度对比测试
- [ ] 修复确认表覆盖 P-04-01/02/03
- [ ] 章末总结回扣 Run Anywhere 赌注
- [ ] Acceptance criteria 场景全部满足
