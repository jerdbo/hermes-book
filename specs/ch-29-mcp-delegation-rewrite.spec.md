# Ch-29: MCP、委派与调度重写

## Meta
- **Design Bet:** Learning Loop（MCP 扩展能力）、Run Anywhere（多环境调度）
- **Volume:** 下卷/重铸
- **Part:** 第八篇：工具与执行重写
- **Word Budget:** 5,000 - 7,000
- **Opening Question:** 如何用类型安全的 JSON-RPC 实现加固 MCP 安全边界，并限制子 Agent 递归深度？

## Intent
本章加固 MCP 安全边界和子 Agent 深度控制。重点是类型安全 JSON-RPC、全局采样速率限制、watchdog、深度硬限制。

## Decisions
- 叙事结构: 先 MCP 安全加固，再委派深度控制，最后定时任务
- 安全重点: 全局采样限制（不仅 per-server）

## Acceptance Criteria
场景: 类型安全 JSON-RPC
  假设 读者了解 JSON-RPC
  当 读完本章
  那么 读者能实现类型安全的 MCP JSON-RPC 协议

场景: 全局限制
  假设 读者关注安全
  当 阅读速率限制部分
  那么 读者能实现全局采样速率限制（不仅 per-server）

场景: watchdog
  假设 读者关注可靠性
  当 阅读 watchdog 部分
  那么 读者能用 tokio::time::timeout 实现 MCP 连接 watchdog

场景: 深度限制
  假设 读者关注递归风险
  当 阅读委派部分
  那么 读者能实现子 Agent 深度硬限制 + 资源预算

场景: 沙箱复用
  假设 读者关注代码执行安全
  当 阅读沙箱部分
  那么 读者能复用 hermes-sandbox 做代码执行隔离

## Core Source Files
| File | Lines | What to Analyze |
|------|-------|-----------------|
| `tools/mcp_tool.py` | all | Python MCP 对照 |
| `tools/delegate_tool.py` | all | Python 委派对照 |
| `tools/code_execution_tool.py` | all | Python 代码执行对照 |

## Required Diagrams
1. Rust MCP 通信架构图
2. 子 Agent 委派深度限制示意图

## Content Boundaries
### In Scope
- 类型安全 JSON-RPC、全局采样限制、MCP watchdog
- 子 Agent 深度限制+资源预算、hermes-sandbox 复用、tokio-cron-scheduler
### Forbidden
- 不要重复 Ch-12 的 Python 分析
### Out of Scope
- 工具注册 → Ch-26
- 终端沙箱基础 → Ch-27

## Fix Targets
P-12-01, P-12-02, P-12-03, P-12-04, P-12-05

## Quality Gates
- [ ] JSON-RPC 有类型安全的请求/响应定义
- [ ] 全局速率限制有与 per-server 的对比
- [ ] watchdog 有 timeout 配置示例
- [ ] 深度限制有编译时保证
- [ ] 修复确认表覆盖所有 Fix Targets
- [ ] 章末总结回扣 Learning Loop 和 Run Anywhere 赌注
- [ ] Acceptance criteria 场景全部满足
