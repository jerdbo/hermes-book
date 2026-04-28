# 解构与重铸 — Hermes Agent 源码深度解析与 Rust 重写实战

[![Deploy Book](https://github.com/jerdbo/hermes-book/actions/workflows/pages.yml/badge.svg)](https://github.com/jerdbo/hermes-book/actions/workflows/pages.yml)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![mdBook](https://img.shields.io/badge/built%20with-mdBook-orange.svg)](https://rust-lang.github.io/mdBook/)

> 一本关于 LLM Agent runtime 的中文技术书 —— 上卷把 [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) 这个 Python 项目拆开看，下卷用 Rust 把它重写出来。

📖 **在线阅读**：<https://jerdbo.github.io/hermes-book/>

🖨️ **离线版/PDF**：<https://jerdbo.github.io/hermes-book/print.html>（浏览器 ⌘+P 即可导出 PDF）

---

## 它是什么

一本工程师写给工程师的 AI Agent 实战书。

- **不是教程** —— 假定你能看懂 Python 和 Rust，知道 LLM 基本概念，关心的是「为什么这样设计」「换种方式行不行」「重写时坑在哪」
- **不是 API 参考** —— hermes-agent 的接口可以读源码，本书讲的是源码读完之后的那一层：架构取舍、职责切分、性能权衡、可演进性
- **是一份 65-问题诊断报告 + Rust 重写工程实战** —— 上卷找出 Python 实现中 65 个具体问题（按 P-XX-XX 编号），下卷用 Rust 一一回应，每章都有可运行的 cargo crate

## 适合谁

| 你是 | 看哪部分 |
|---|---|
| LLM agent 框架的开发者 / 评估者 | 上卷第 1、17 章 + 附录 D |
| 想从 Python agent 迁到 Rust 的人 | 下卷第 18 章起 |
| 关心多平台 IM 适配（飞书/Slack/Telegram）的人 | 第 13-14 + 30-31 章 |
| 关心工具系统 / MCP / 沙箱的人 | 第 9-12 + 26-29 章 |
| 关心 prompt / 上下文 / 记忆的人 | 第 5-8 + 24-25 章 |

## 目录

### 上卷：解构 — Hermes Agent 源码深度解析与问题诊断

**第一篇：架构基础**
- 第 1 章：设计赌注与竞争差异
- 第 2 章：仓库地图与五层架构
- 第 3 章：一次请求的旅程
- 第 4 章：LLM 通信层

**第二篇：核心引擎**
- 第 5 章：提示工程
- 第 6 章：上下文管理
- 第 7 章：记忆系统
- 第 8 章：会话持久化

**第三篇：工具与执行**
- 第 9 章：工具注册与分发
- 第 10 章：终端执行引擎
- 第 11 章：文件、Web 与浏览器工具
- 第 12 章：MCP、代码执行与委派

**第四篇：平台与交互**
- 第 13 章：消息网关架构
- 第 14 章：平台适配器
- 第 15 章：CLI 与 TUI
- 第 16 章：技能与插件系统

**第五篇：诊断报告**
- 第 17 章：问题总览与严重程度排序

### 下卷：重铸 — 用 Rust 重写生产级 AI Agent

**第六篇：Rust 基础设施**
- 第 18 章：为什么用 Rust 重写
- 第 19 章：项目脚手架与 Workspace 设计
- 第 20 章：错误处理与类型系统设计
- 第 21 章：异步运行时与并发模型

**第七篇：核心引擎重写**
- 第 22 章：Agent Loop 重写
- 第 23 章：LLM Provider 层重写
- 第 24 章：提示工程与上下文管理重写
- 第 25 章：记忆与会话存储重写

**第八篇：工具与执行重写**
- 第 26 章：工具注册系统重写
- 第 27 章：终端执行引擎与沙箱重写
- 第 28 章：文件、Web 与浏览器工具重写
- 第 29 章：MCP、委派与调度重写

**第九篇：平台与交互重写**
- 第 30 章：消息网关重写
- 第 31 章：平台适配器重写
- 第 32 章：CLI 与 TUI 重写
- 第 33 章：技能与插件系统重写

**第十篇：工程总结**
- 第 34 章：对比、基准与展望

### 附录

- 附录 A：关键文件索引
- 附录 B：流程图汇总
- 附录 C：术语表
- 附录 D：阅读导航（按背景/兴趣推荐章节）

> 总规模：34 章 + 4 附录，约 33,500 行，配 100+ Mermaid 流程图，65 个问题矩阵 (P-XX-XX)。

## 配套代码

下卷每章对应一个或多个可运行的 cargo crate，全部聚集在 [hermes-rs](https://github.com/jerdbo/hermes-rs)（如果该 repo 公开）—— 11 个 crate 的工作区，398 个测试，零 clippy 警告。

## 本地构建

```bash
# 一次性安装
cargo install mdbook --no-default-features --features search --vers "^0.4" --locked
# 中文搜索索引（CI 也用同一个）
npm i -g pagefind                 # 或 npx --yes pagefind@latest

# 实时预览（http://localhost:3000，热重载）
mdbook serve

# 一次性构建 + 生成搜索索引
mdbook build
pagefind --site book
```

## 工程细节

| 模块 | 选型 |
|---|---|
| 静态站点生成 | [mdBook](https://rust-lang.github.io/mdBook/) (Rust，官方主题 ayu 暗色) |
| 全文搜索 | [Pagefind](https://pagefind.app/) — CJK-aware，替代 mdBook 内置搜索 |
| 流程图 | [Mermaid](https://mermaid.js.org/) — 客户端渲染，避免 mdbook-mermaid preprocessor 的 UTF-8 解析问题 |
| CI/CD | GitHub Actions → GitHub Pages，每次 push main 自动部署 |
| 字体 | mdBook 默认（思源系/苹方/Helvetica 回退栈） |

参考：[`book.toml`](book.toml)、[`.github/workflows/pages.yml`](.github/workflows/pages.yml)、[`mermaid-init.js`](mermaid-init.js)

## 许可

源码引用与节选遵循上游 [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) 的许可。本书原创内容（章节文本、流程图、问题矩阵等）按 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授权 —— 可自由阅读分发与改编，但需署名、不得商用、衍生作品采用相同许可。

## 反馈

发现错漏 / 有更好的解释 / 想补一个章节？欢迎提 issue 或 PR：<https://github.com/jerdbo/hermes-book/issues>
