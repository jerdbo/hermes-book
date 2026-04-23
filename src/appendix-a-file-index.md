# 附录 A：关键文件索引

本附录按五层架构组织了全书涉及的所有核心源代码文件，便于读者快速定位和查阅。

## 文件索引表

| 文件路径 | 代码行数 | 架构层级 | 章节引用 |
|---------|---------|---------|---------|
| **Layer 1: 入口与 CLI** | | | |
| `cli.py` | ~11,045 | 入口与 CLI | Ch-15 |
| `hermes_cli/main.py` | - | 入口与 CLI | Ch-02 |
| `hermes_cli/commands.py` | - | 入口与 CLI | Ch-15 |
| `hermes_cli/skin_engine.py` | - | 入口与 CLI | Ch-15 |
| `hermes_cli/plugins.py` | - | 入口与 CLI | Ch-16 |
| **Layer 2: Agent 核心** | | | |
| `run_agent.py` | ~12,164 | Agent 核心 | Ch-03 |
| `agent/error_classifier.py` | ~834 | Agent 核心 | Ch-03 |
| `agent/retry_utils.py` | - | Agent 核心 | Ch-03 |
| `agent/transports/` | - | Agent 核心 | Ch-04 |
| `agent/model_metadata.py` | - | Agent 核心 | Ch-04 |
| `agent/prompt_builder.py` | - | Agent 核心 | Ch-05 |
| `agent/context_compressor.py` | - | Agent 核心 | Ch-06 |
| `agent/memory_manager.py` | - | Agent 核心 | Ch-07 |
| `agent/memory_provider.py` | - | Agent 核心 | Ch-07 |
| `agent/skill_commands.py` | - | Agent 核心 | Ch-16 |
| `agent/skill_utils.py` | - | Agent 核心 | Ch-16 |
| **Layer 3: 工具与执行** | | | |
| `tools/registry.py` | - | 工具与执行 | Ch-09 |
| `tools/model_tools.py` | - | 工具与执行 | Ch-09 |
| `tools/terminal_tool.py` | ~2,074 | 工具与执行 | Ch-10 |
| `tools/approval.py` | ~994 | 工具与执行 | Ch-10 |
| `tools/environments/base.py` | - | 工具与执行 | Ch-10 |
| `tools/environments/local.py` | - | 工具与执行 | Ch-10 |
| `tools/file_tools.py` | ~945 | 工具与执行 | Ch-11 |
| `tools/web_tools.py` | ~2,101 | 工具与执行 | Ch-11 |
| `tools/browser_tool.py` | ~2,514 | 工具与执行 | Ch-11 |
| `tools/browser_cdp_tool.py` | - | 工具与执行 | Ch-11 |
| `tools/vision_tools.py` | - | 工具与执行 | Ch-11 |
| `tools/mcp_tool.py` | ~2,500 | 工具与执行 | Ch-12 |
| `tools/code_execution_tool.py` | - | 工具与执行 | Ch-12 |
| `tools/delegate_tool.py` | - | 工具与执行 | Ch-12 |
| `tools/memory_tool.py` | - | 工具与执行 | Ch-07 |
| `tools/skills_tool.py` | - | 工具与执行 | Ch-16 |
| `tools/skill_manager_tool.py` | - | 工具与执行 | Ch-16 |
| `tools/skills_hub.py` | - | 工具与执行 | Ch-16 |
| `tools/skills_guard.py` | - | 工具与执行 | Ch-16 |
| **Layer 4: 网关与平台** | | | |
| `gateway/run.py` | ~11,170 | 网关与平台 | Ch-13 |
| `gateway/session.py` | - | 网关与平台 | Ch-13 |
| `gateway/delivery.py` | - | 网关与平台 | Ch-13 |
| `gateway/hooks.py` | - | 网关与平台 | Ch-13 |
| `gateway/pairing.py` | - | 网关与平台 | Ch-13 |
| `gateway/platforms/base.py` | - | 网关与平台 | Ch-14 |
| `gateway/platforms/telegram.py` | - | 网关与平台 | Ch-14 |
| `gateway/platforms/discord.py` | - | 网关与平台 | Ch-14 |
| `gateway/platforms/whatsapp.py` | - | 网关与平台 | Ch-14 |
| `gateway/platforms/*` | - | 网关与平台 | Ch-14 |
| **Layer 5: 存储** | | | |
| `hermes_state.py` | ~1,591 | 存储 | Ch-08 |
| `plugins/memory/` | - | 存储 | Ch-07 |

## 架构层级说明

### Layer 1: 入口与 CLI
用户交互的第一层，处理命令行参数解析、皮肤渲染、插件加载等功能。

### Layer 2: Agent 核心
Agent 的核心逻辑层，包括主循环控制、错误处理、重试机制、传输层、提示词构建、上下文压缩、记忆管理等。

### Layer 3: 工具与执行
工具注册与执行层，提供文件操作、终端执行、Web 交互、浏览器控制、MCP 协议、代码执行、技能管理等工具能力。

### Layer 4: 网关与平台
多平台接入网关层，支持 Telegram、Discord、WhatsApp 等 15+ 平台适配器，以及会话管理、消息分发、钩子机制等。

### Layer 5: 存储
状态持久化层，负责 Agent 状态存储、记忆插件管理等数据持久化功能。

## 使用说明

- **代码行数**：标注了 `~` 的为近似值，主要用于标识大型文件
- **架构层级**：按照自顶向下的调用关系组织
- **章节引用**：指向书中详细讲解该文件的章节
- **路径格式**：所有路径均相对于项目根目录

---

*注：本索引涵盖了 Hermes Agent 项目的核心文件。部分平台适配器（gateway/platforms/ 下约 15 个文件）因篇幅原因未完全列出，详见 Ch-14。*
