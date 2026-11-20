---
kind: upgrade-guide
description: "The default provider changes from DeepSeek to OpenRouter, so new Agents and SDK sessions without a saved or explicit route use openrouter/qwen/qwen4-max and read OPENROUTER_API_KEY."
---

# The default provider is OpenRouter

English | [中文](guide.zh.md)

## Change

The [default provider](../../../glossary.md#default-provider) was `deepseek-official` with model `deepseek-flash` in the shipped profiles, and `deepseek-official` with `deepseek-v4-flash` in the SDKs and ACP. It is now the `openrouter` route with model `qwen/qwen4-max` everywhere. The `llm-pi-ai` row in the base, ACP, and `sdk-minimal` compositions declares that route, keyed by `OPENROUTER_API_KEY`.

These readers are affected:

- A user with no saved model selection: new Agents use OpenRouter and need `OPENROUTER_API_KEY` in the environment, a `.env` file, or saved credentials. A saved selection still takes precedence.
- The TypeScript SDK `DeepSeekHarness` and the Python `DeepSeekHarnessConfig`: omitted `provider` and `model` now mean `openrouter` and `qwen/qwen4-max`. The Python `api_key` option now sets `OPENROUTER_API_KEY` instead of `DEEPSEEK_API_KEY`.
- `dsh-subagent-dsh-sdk`: omitted `provider` and `model` config fields default to the OpenRouter route, so the child needs `OPENROUTER_API_KEY` in its `env`.
- The `sdk-minimal` profile now mounts `@deepseek-ai/dsh-llm-pi-ai`.

The DeepSeek routes stay mounted and keep reading `DEEPSEEK_API_KEY`.

## Migration

1. To keep using OpenRouter, set `OPENROUTER_API_KEY`. No other change is needed.
2. To keep using DeepSeek, select it explicitly:
   - In Web or Desktop, choose a DeepSeek model once; the saved selection persists.
   - In a profile patch, set `{ id: agent-default-model, config: { provider: deepseek-official, model: deepseek-flash } }`.
   - In the TypeScript SDK, pass `provider: 'deepseek-official'` and a DeepSeek `model`. In Python, pass `provider="deepseek-official"`, a DeepSeek `model`, and set `DEEPSEEK_API_KEY` through `env` or the environment instead of `api_key`.
   - In `subagent-dsh-sdk`, set `provider`, `model`, and `env.DEEPSEEK_API_KEY`.
3. Confirm the route by starting one Session: its `request/header` event names the expected `provider` and `model`.
