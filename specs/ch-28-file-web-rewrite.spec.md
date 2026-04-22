# Ch-28: 文件、Web 与浏览器工具重写

## Meta
- **Design Bet:** CLI-First（可靠的文件操作）
- **Volume:** 下卷/重铸
- **Part:** 第八篇：工具与执行重写
- **Word Budget:** 4,000 - 5,000
- **Opening Question:** 如何让文件写入变为原子操作，让 Web 请求有统一的重试和超时策略？

## Intent
本章实现原子文件操作和可靠 Web 请求。篇幅较短，重点是 tempfile+rename 原子写入和 reqwest 中间件。

## Decisions
- 叙事结构: 文件 → Web → 浏览器，按问题修复组织
- 篇幅: 较简单，控制在 4000-5000 字

## Acceptance Criteria
场景: 原子写入
  假设 读者了解文件系统
  当 读完本章
  那么 读者能用 tempfile + rename 实现原子文件写入

场景: 可靠请求
  假设 读者关注网络可靠性
  当 阅读 Web 部分
  那么 读者能用 reqwest 连接池 + 重试/超时中间件实现可靠 Web 请求

场景: 浏览器控制
  假设 读者需要浏览器自动化
  当 阅读浏览器部分
  那么 读者能用 chromiumoxide 实现异步浏览器控制

场景: 并行限流
  假设 读者需要批量爬取
  当 阅读爬取部分
  那么 读者能用 Stream + 信号量实现并行爬取限流

## Core Source Files
| File | Lines | What to Analyze |
|------|-------|-----------------|
| `tools/file_tools.py` | all | Python 文件工具对照 |
| `tools/web_tools.py` | all | Python Web 工具对照 |
| `tools/browser_tool.py` | all | Python 浏览器对照 |

## Required Diagrams
1. 原子文件写入流程图（write → tempfile → fsync → rename）

## Content Boundaries
### In Scope
- 原子文件写入、reqwest 连接池+重试/超时、chromiumoxide、Stream+信号量
### Forbidden
- 不要重复 Ch-11 的 Python 分析
### Out of Scope
- 工具注册 → Ch-26
- 终端执行 → Ch-27

## Fix Targets
P-11-01, P-11-02, P-11-03

## Quality Gates
- [ ] 原子写入有完整代码和测试
- [ ] reqwest 中间件有配置示例
- [ ] 修复确认表覆盖 P-11-01/02
- [ ] 章末总结回扣 CLI-First 赌注
- [ ] Acceptance criteria 场景全部满足
