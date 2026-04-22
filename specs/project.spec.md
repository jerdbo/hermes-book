# Project Spec: 解构与重铸

## Meta
- **Target Audience:** 有 Python 经验、想学 Rust 的 AI 工程师
- **Total Chapters:** 34 + 4 appendices
- **Upper Volume:** 17 chapters (source analysis + problem discovery)
- **Lower Volume:** 17 chapters (Rust rewrite + problem fix)
- **Language:** 正文中文，代码注释英文

## Four Design Bets (全书叙事主线)
1. **Learning Loop** — Agent 从任务中自动生成技能并持续优化
2. **CLI-First** — 终端是一等公民入口
3. **Personal Long-Term** — 跨会话记忆，Agent 越用越懂你
4. **Run Anywhere** — 从 $5 VPS 到 GPU 集群

## Problem Numbering
- Format: `P-{chapter}-{seq} [{Type}/{Severity}]`
- Types: Perf, Arch, Sec, Rel
- Severities: Critical, High, Medium, Low

## Five-Layer Architecture Model
1. Entry (入口层) — Ch13, 15
2. Orchestration (编排层) — Ch3-4
3. Capability (能力层) — Ch9-12
4. State (状态层) — Ch5-8
5. Platform (平台层) — Ch13-14, 16

## Quality Gates (project-level)
- Every chapter maps to ≥1 design bet
- Every technical claim has `filename:linenumber` reference
- Every chapter has ≥1 Mermaid diagram
- Upper volume chapters produce numbered problem lists
- Lower volume chapters have fix confirmation tables
- Three-agent review passes before chapter completion
