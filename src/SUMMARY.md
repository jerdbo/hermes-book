# Summary

[前言](preface.md)

---

# 上卷：解构 — Hermes Agent 源码深度解析与问题诊断

## 第一篇：架构基础

- [第1章：设计赌注与竞争差异](part1/ch01-design-bets.md)
- [第2章：仓库地图与五层架构](part1/ch02-repo-map.md)
- [第3章：一次请求的旅程](part1/ch03-request-journey.md)
- [第4章：LLM 通信层](part1/ch04-llm-transport.md)

## 第二篇：核心引擎

- [第5章：提示工程](part2/ch05-prompt-engineering.md)
- [第6章：上下文管理](part2/ch06-context-management.md)
- [第7章：记忆系统](part2/ch07-memory-system.md)
- [第8章：会话持久化](part2/ch08-session-persistence.md)

## 第三篇：工具与执行

- [第9章：工具注册与分发](part3/ch09-tool-registry.md)
- [第10章：终端执行引擎](part3/ch10-terminal-engine.md)
- [第11章：文件、Web 与浏览器工具](part3/ch11-file-web-browser.md)
- [第12章：MCP、代码执行与委派](part3/ch12-mcp-delegation.md)

## 第四篇：平台与交互

- [第13章：消息网关架构](part4/ch13-gateway.md)
- [第14章：平台适配器](part4/ch14-platform-adapters.md)
- [第15章：CLI 与 TUI](part4/ch15-cli-tui.md)
- [第16章：技能与插件系统](part4/ch16-skills-plugins.md)

## 第五篇：诊断报告

- [第17章：问题总览与严重程度排序](part5/ch17-diagnosis.md)

---

# 下卷：重铸 — 用 Rust 重写生产级 AI Agent

## 第六篇：Rust 基础设施

- [第18章：为什么用 Rust 重写](part6/ch18-why-rust.md)
- [第19章：项目脚手架与 Workspace 设计](part6/ch19-workspace.md)
- [第20章：错误处理与类型系统设计](part6/ch20-type-system.md)
- [第21章：异步运行时与并发模型](part6/ch21-async-concurrency.md)

## 第七篇：核心引擎重写

- [第22章：Agent Loop 重写](part7/ch22-agent-loop-rewrite.md)
- [第23章：LLM Provider 层重写](part7/ch23-llm-rewrite.md)
- [第24章：提示工程与上下文管理重写](part7/ch24-prompt-context-rewrite.md)
- [第25章：记忆与会话存储重写](part7/ch25-memory-rewrite.md)

## 第八篇：工具与执行重写

- [第26章：工具注册系统重写](part8/ch26-tool-registry-rewrite.md)
- [第27章：终端执行引擎与沙箱重写](part8/ch27-terminal-sandbox-rewrite.md)
- [第28章：文件、Web 与浏览器工具重写](part8/ch28-file-web-rewrite.md)
- [第29章：MCP、委派与调度重写](part8/ch29-mcp-delegation-rewrite.md)

## 第九篇：平台与交互重写

- [第30章：消息网关重写](part9/ch30-gateway-rewrite.md)
- [第31章：平台适配器重写](part9/ch31-adapter-rewrite.md)
- [第32章：CLI 与 TUI 重写](part9/ch32-cli-tui-rewrite.md)
- [第33章：技能与插件系统重写](part9/ch33-skills-rewrite.md)

## 第十篇：工程总结

- [第34章：对比、基准与展望](part10/ch34-conclusion.md)

---

# 附录

- [附录 A：关键文件索引](appendix/a-file-index.md)
- [附录 B：流程图汇总](appendix/b-flowcharts.md)
- [附录 C：术语表](appendix/c-glossary.md)
- [附录 D：阅读导航](appendix/d-reading-guide.md)
