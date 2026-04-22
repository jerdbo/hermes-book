# Ch-12: MCP、代码执行与委派

## Meta
- **Design Bet:** Learning Loop（MCP 扩展能力边界）、Run Anywhere（多种执行环境）
- **Volume:** 上卷/解构
- **Part:** 第三篇：工具与执行
- **Word Budget:** 5,000 - 7,000
- **Opening Question:** 如何让 AI Agent 安全地调用外部服务（MCP）、执行任意代码、并将子任务委派给其他 Agent？

## Intent

本章分析三个相关系统：MCP 协议集成（外部服务）、代码执行沙箱（运行用户代码）、子 Agent 委派（任务分解）。重点是 MCP 的安全边界和委派深度控制缺失。

## Decisions

- 叙事结构: MCP 协议 → 代码执行 → 委派，按能力扩展的复杂度递进
- MCP 重点: 双传输模式和安全边界

## Acceptance Criteria

场景: MCP 双传输
  假设 读者了解 JSON-RPC
  当 读完本章
  那么 读者能追踪 MCP 双传输模式：stdio（子进程管道）和 HTTP（StreamableHTTP）

场景: 重连策略
  假设 读者关注可靠性
  当 阅读重连部分
  那么 读者能解释重连策略（指数退避，最大 60s）和重试预算

场景: 采样限制
  假设 读者关注安全
  当 阅读采样部分
  那么 读者能理解采样支持和速率限制（per-server 但无全局限制）

场景: 凭证安全
  假设 读者关注凭证泄漏
  当 阅读安全部分
  那么 读者能说出环境过滤和凭证剥离的安全机制

场景: 委派深度
  假设 读者关注递归风险
  当 阅读委派部分
  那么 读者能解释子 Agent 委派深度无硬限制的风险

## Core Source Files

| File | Lines | What to Analyze |
|------|-------|-----------------|
| `tools/mcp_tool.py` | all (~1050) | MCP 协议、双传输、重连、采样 |
| `tools/code_execution_tool.py` | all | 代码执行沙箱 |
| `tools/delegate_tool.py` | all | 子 Agent 委派 |
| `tools/image_gen_provider.py` | all | 图像生成 |
| `tools/cronjob_tools.py` | all | 定时任务 |

## Required Diagrams

1. MCP 协议通信架构图（stdio/HTTP 双传输 + 重连策略）
2. 子 Agent 委派层级图

## Content Boundaries

### In Scope
- MCP 协议完整分析、代码执行沙箱、子 Agent 委派、图像生成、定时任务

### Forbidden
- 不要以 mcp_tool.py 类结构开头
- 不要重复 Ch-09 的工具注册内容

### Out of Scope
- 工具注册 → Ch-09
- 终端执行 → Ch-10
- 网关消息分发 → Ch-13

## Problem IDs

- P-12-01 [Sec/High] MCP 采样速率限制弱（无全局限制）
- P-12-02 [Sec/Medium] 凭证清除不完整
- P-12-03 [Rel/Medium] MCP 后台线程无 watchdog
- P-12-04 [Rel/Medium] 委派深度无硬限制
- P-12-05 [Sec/Low] 代码执行沙箱隔离弱

## Quality Gates

- [ ] 双传输模式有代码对比
- [ ] 重连策略有参数引用
- [ ] 采样速率限制的 per-server vs 全局差异有分析
- [ ] 凭证剥离的正则和遗漏有代码引用
- [ ] 章末总结回扣 Learning Loop 和 Run Anywhere 赌注
- [ ] Acceptance criteria 场景全部满足
