# Ch-10: 终端执行引擎

## Meta
- **Design Bet:** Run Anywhere（多执行后端支撑多环境）、CLI-First（终端安全是 CLI-First 的基石）
- **Volume:** 上卷/解构
- **Part:** 第三篇：工具与执行
- **Word Budget:** 6,000 - 8,000
- **Opening Question:** 当 AI Agent 可以执行任意 Shell 命令时，如何在灵活性和安全性之间取得平衡？

## Intent

本章深度解读终端执行引擎和安全审批机制。这是上卷中安全分析最密集的章节，涵盖 6 种执行后端、139 条危险命令正则、三种审批模式。重点揭示"无系统级沙箱"这个最严重的安全问题。

## Decisions

- 叙事结构: 先安全挑战（灵活性 vs 安全性），再执行后端，最后审批机制
- 安全重点: P-10-01（无系统级沙箱）是全书最严重的安全问题

## Acceptance Criteria

场景: 执行后端
  假设 读者了解 Shell 执行
  当 读完本章
  那么 读者能列出 6 种执行后端及适用场景

场景: 危险命令检测
  假设 读者关注安全
  当 阅读命令检测部分
  那么 读者能解释 139 条正则的工作方式（Unicode NFKC + ANSI 剥离）

场景: 审批模式
  假设 读者需要配置安全策略
  当 阅读审批部分
  那么 读者能区分三种审批模式（manual/smart/off）的安全级别

场景: 网关审批
  假设 读者关注网关场景
  当 阅读网关审批部分
  那么 读者能追踪阻塞流程：threading.Event.wait(300s) + 1s 轮询

场景: 正则漏洞
  假设 读者关注安全漏洞
  当 阅读正则分析部分
  那么 读者能解释正则无锚定漏洞（rm -r 匹配到 echo "rm -r is dangerous"）

场景: 沙箱缺失
  假设 读者关注系统安全
  当 阅读安全总结部分
  那么 读者能理解无系统级沙箱（Landlock/Seatbelt）是最严重的安全问题

## Core Source Files

| File | Lines | What to Analyze |
|------|-------|-----------------|
| `tools/terminal_tool.py` | all | 终端工具核心 |
| `tools/approval.py` | all (~995) | 139 条正则、审批逻辑 |
| `tools/environments/` | all | 6 种执行后端 |
| `tools/process_registry.py` | all | 后台进程管理 |
| `gateway/pairing.py` | all | 配对审批 |

## Required Diagrams

1. 命令执行安全检查流程图（命令 → Unicode 标准化 → 正则匹配 → 审批 → 执行）
2. 6 种执行后端架构图

## Content Boundaries

### In Scope
- 终端工具核心、6 种执行后端、139 条正则
- Unicode NFKC + ANSI 剥离、三种审批模式
- 阻塞式网关审批、Smart Approval、配对审批
- 后台进程注册表

### Forbidden
- 不要以 terminal_tool.py 代码结构开头
- 不要弱化沙箱缺失问题的严重性

### Out of Scope
- MCP 沙箱 → Ch-12
- 网关整体架构 → Ch-13
- 代码执行工具 → Ch-12

## Problem IDs

- P-10-01 [Sec/Critical] 无系统级沙箱
- P-10-02 [Sec/High] 正则无锚定
- P-10-03 [Sec/High] Smart Approval 非确定性
- P-10-04 [Sec/Medium] 无白名单机制
- P-10-05 [Perf/Medium] 审批轮询开销
- P-10-06 [Rel/Medium] 无审批审计日志
- P-10-07 [Rel/Low] 进程泄漏风险

## Quality Gates

- [ ] 139 条正则有分类统计和代表性示例
- [ ] Unicode NFKC 和 ANSI 剥离有代码引用
- [ ] Smart Approval 非确定性有具体场景说明
- [ ] 系统级沙箱缺失的影响分析充分
- [ ] 章末总结回扣 Run Anywhere 和 CLI-First 赌注
- [ ] Acceptance criteria 场景全部满足
