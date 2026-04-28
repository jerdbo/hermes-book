# 解构与重铸 — Hermes Agent 源码深度解析与 Rust 重写实战

[![Deploy Book](https://github.com/jerdbo/hermes-book/actions/workflows/pages.yml/badge.svg)](https://github.com/jerdbo/hermes-book/actions/workflows/pages.yml)

中文技术书。34 章 + 4 附录，~33,500 行。

- 上半部：分析 [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) 这个 Python LLM agent runtime 的设计取舍与代码实现。
- 下半部：用 Rust 重写 hermes-agent 的工程实战 —— 工作区切分、错误模型、provider 抽象、tool/hook/sandbox 体系、session 持久化、MCP 集成等。
- 附录：65 个问题矩阵（P-XX-XX）、文件索引、流程图汇总、术语表、阅读路径推荐。

📖 在线阅读：<https://jerdbo.github.io/hermes-book/>

## 本地构建

```bash
# 安装 mdBook 与 pagefind（一次性）
cargo install mdbook --no-default-features --features search --vers "^0.4" --locked
npm i -g pagefind   # 或使用 npx --yes pagefind@latest

# 实时预览（http://localhost:3000）
mdbook serve

# 一次性构建 + 生成中文搜索索引
mdbook build && pagefind --site book
```

## 工程细节

- **mdBook + Pagefind**：mdBook 自带搜索对中文不友好，已禁用，改由 [Pagefind](https://pagefind.app/) 在 build 后扫描 HTML 生成 CJK-aware 索引。
- **Mermaid**：图表通过 [`mermaid.min.js`](mermaid.min.js) + [`mermaid-init.js`](mermaid-init.js) 在客户端渲染。
- **主题**：`light` 默认，`ayu` 暗色。
- **CI**：[`.github/workflows/pages.yml`](.github/workflows/pages.yml) — 每次 push main 自动构建 + 部署到 GitHub Pages。

## 许可

源码引用与节选遵循上游 [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) 的许可。本书原创内容（章节文本、流程图、问题矩阵等）默认 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)。
