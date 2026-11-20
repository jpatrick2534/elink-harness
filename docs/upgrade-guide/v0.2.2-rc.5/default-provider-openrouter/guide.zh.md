---
kind: upgrade-guide
description: "默认提供方从 DeepSeek 改为 OpenRouter，没有已保存或显式路由的新 Agent 与 SDK 会话改用 openrouter/qwen/qwen4-max，并读取 OPENROUTER_API_KEY。"
---

# 默认提供方改为 OpenRouter

[English](guide.md) | 中文

## 变更

[默认提供方](../../../glossary.zh.md#default-provider)此前在发行 profile 中是 `deepseek-official` 与模型 `deepseek-flash`，在 SDK 与 ACP 中是 `deepseek-official` 与 `deepseek-v4-flash`。现在各处都改为 `openrouter` 路由与模型 `qwen/qwen4-max`。base、ACP 与 `sdk-minimal` 组合中的 `llm-pi-ai` 行声明该路由，以 `OPENROUTER_API_KEY` 作为密钥。

受影响的读者如下：

- 没有已保存模型选择的用户：新 Agent 使用 OpenRouter，需要在环境变量、`.env` 文件或已保存凭据中提供 `OPENROUTER_API_KEY`。已保存的选择仍然优先。
- TypeScript SDK 的 `DeepSeekHarness` 与 Python 的 `DeepSeekHarnessConfig`：省略 `provider` 与 `model` 时，现在表示 `openrouter` 与 `qwen/qwen4-max`。Python 的 `api_key` 选项现在设置 `OPENROUTER_API_KEY`，不再设置 `DEEPSEEK_API_KEY`。
- `dsh-subagent-dsh-sdk`：省略的 `provider` 与 `model` 配置字段默认使用 OpenRouter 路由，因此子进程的 `env` 中需要 `OPENROUTER_API_KEY`。
- `sdk-minimal` profile 现在挂载 `@deepseek-ai/dsh-llm-pi-ai`。

DeepSeek 路由仍然挂载，并继续读取 `DEEPSEEK_API_KEY`。

## 迁移

1. 要使用 OpenRouter，设置 `OPENROUTER_API_KEY` 即可，无需其他修改。
2. 要继续使用 DeepSeek，请显式选择：
   - 在 Web 或 Desktop 中选择一次 DeepSeek 模型；已保存的选择会持续生效。
   - 在 profile patch 中设置 `{ id: agent-default-model, config: { provider: deepseek-official, model: deepseek-flash } }`。
   - 在 TypeScript SDK 中传入 `provider: 'deepseek-official'` 与 DeepSeek `model`。在 Python 中传入 `provider="deepseek-official"` 与 DeepSeek `model`，并通过 `env` 或环境变量设置 `DEEPSEEK_API_KEY`，不要使用 `api_key`。
   - 在 `subagent-dsh-sdk` 中设置 `provider`、`model` 与 `env.DEEPSEEK_API_KEY`。
3. 启动一个 Session 确认路由：其 `request/header` 事件应列出预期的 `provider` 与 `model`。
