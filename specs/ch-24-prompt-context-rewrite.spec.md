# Ch-24: 提示工程与上下文管理重写

## Meta
- **Design Bet:** Personal Long-Term（上下文管理保障长期对话质量）、Learning Loop（安全的提示注入）
- **Volume:** 下卷/重铸
- **Part:** 第七篇：核心引擎重写
- **Word Budget:** 6,000 - 8,000
- **Opening Question:** 如何让提示注入检测从"只 log 不拦截"升级为"硬拦截 + 用户通知"？

## Intent
本章重构提示组装和上下文压缩。重点是 PromptBuilder 类型安全设计、提示注入硬拦截、新增微压缩层、Repo Map 思想引入。

## Decisions
- 叙事结构: 先安全升级（硬拦截），再压缩升级（微压缩），最后 Repo Map
- 安全重点: 从 log-only 到 hard-block 的升级路径

## Acceptance Criteria
场景: PromptBuilder
  假设 读者了解 Ch-05 的 6 层注入
  当 读完本章
  那么 读者能实现类型安全的 PromptBuilder（编译时保证不超窗口）

场景: 硬拦截
  假设 读者关注安全升级
  当 阅读注入检测部分
  那么 读者能实现提示注入硬拦截逻辑

场景: 微压缩
  假设 读者关注压缩精度
  当 阅读压缩部分
  那么 读者能实现三级压缩：工具预处理 + 微压缩(新增) + LLM 全量压缩

场景: 预算检查
  假设 读者关注资源控制
  当 阅读预算部分
  那么 读者能实现上下文文件预算检查

场景: Repo Map
  假设 读者关注 Token 效率
  当 阅读 Repo Map 部分
  那么 读者能理解 Repo Map 思想的引入

## Core Source Files
| File | Lines | What to Analyze |
|------|-------|-----------------|
| `agent/prompt_builder.py` | all | Python 提示组装对照 |
| `agent/context_compressor.py` | all | Python 压缩器对照 |

## Required Diagrams
1. Rust 三级压缩策略流程图
2. PromptBuilder 类型安全组装流程图

## Content Boundaries
### In Scope
- PromptBuilder 类型安全设计、提示注入硬拦截、上下文文件预算
- 三级压缩策略、Token 预算系统、Repo Map 引入
### Forbidden
- 不要重复 Ch-05/Ch-06 的 Python 分析（用编号引用）
### Out of Scope
- LLM Provider → Ch-23
- 记忆系统 → Ch-25

## Fix Targets
P-05-01, P-05-02, P-05-03, P-05-04, P-06-01, P-06-02, P-06-03, P-06-04, P-06-05

## Quality Gates
- [ ] PromptBuilder 有编译时安全保证的具体代码
- [ ] 注入硬拦截有测试用例
- [ ] 微压缩有具体算法和代码
- [ ] 修复确认表覆盖所有 Fix Targets
- [ ] 章末总结回扣 Personal Long-Term 和 Learning Loop 赌注
- [ ] Acceptance criteria 场景全部满足
