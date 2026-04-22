# Ch-11: 文件、Web 与浏览器工具

## Meta
- **Design Bet:** CLI-First（文件操作是 CLI 工作流核心）
- **Volume:** 上卷/解构
- **Part:** 第三篇：工具与执行
- **Word Budget:** 4,000 - 5,000
- **Opening Question:** AI Agent 如何安全地操作文件系统、访问 Web 和控制浏览器？

## Intent

本章分析文件操作、Web 请求和浏览器自动化三类工具。重点揭示文件写入非原子和 Web 超时处理粗放的问题。

## Decisions

- 叙事结构: 按文件 → Web → 浏览器三类组织
- 篇幅控制: 中等复杂度，控制在 4000-5000 字

## Acceptance Criteria

场景: 文件操作
  假设 读者了解文件系统操作
  当 读完本章
  那么 读者能说出文件工具的四种能力（读、写、补丁/fuzzy matching、搜索）

场景: Web 爬取
  假设 读者关注数据获取
  当 阅读 Web 工具部分
  那么 读者能解释并行爬取机制

场景: 浏览器控制
  假设 读者想了解浏览器自动化
  当 阅读浏览器部分
  那么 读者能理解 CDP 控制方式及第三方 Provider

场景: 非原子风险
  假设 读者关注数据安全
  当 阅读文件写入部分
  那么 读者能识别文件写入非原子的风险（无 tempfile + rename）

## Core Source Files

| File | Lines | What to Analyze |
|------|-------|-----------------|
| `tools/file_tools.py` | all | 文件读写、补丁、搜索 |
| `tools/web_tools.py` | all | Web 搜索、提取、爬取 |
| `tools/browser_tool.py` | all | 浏览器自动化 |
| `tools/browser_cdp_tool.py` | all | CDP 浏览器控制 |
| `tools/vision_tool.py` | all | 视觉分析 |

## Required Diagrams

1. 工具能力矩阵图（文件/Web/浏览器 × 读/写/搜索/自动化）

## Content Boundaries

### In Scope
- 文件操作工具、Web 工具、浏览器自动化、视觉分析

### Forbidden
- 不要以文件列表开头
- 不要重复 Ch-10 的终端执行内容

### Out of Scope
- 终端执行 → Ch-10
- 工具注册 → Ch-09
- MCP 工具 → Ch-12

## Problem IDs

- P-11-01 [Rel/Medium] 文件写入非原子
- P-11-02 [Rel/Medium] Web 请求超时处理粗放
- P-11-03 [Sec/Low] 浏览器工具无沙箱

## Quality Gates

- [ ] 文件补丁的 fuzzy matching 有代码解释
- [ ] Web 并行爬取机制有代码引用
- [ ] 浏览器 CDP 控制有代码引用
- [ ] 章末总结回扣 CLI-First 赌注
- [ ] Acceptance criteria 场景全部满足
