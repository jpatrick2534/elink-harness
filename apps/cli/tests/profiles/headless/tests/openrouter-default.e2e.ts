import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { runLoaderSmoke } from '@deepseek-ai/dsh-loader-smoke'

const binScript = fileURLToPath(new URL('../../../../../../packages/test-support/loader-smoke/tests/fixtures/headless-driver.ts', import.meta.url))
const configPath = fileURLToPath(new URL('../openrouter-default.patch.yml', import.meta.url))
const tsconfigPath = fileURLToPath(new URL('../../../../../../tsconfig.json', import.meta.url))
const hasKey = Boolean(process.env.OPENROUTER_API_KEY)

interface HeaderConfig { provider?: string; model?: string }

/** Reads the route of the first `request/header` event from the driver's JSONL output. */
function requestRoute(stdout: string): HeaderConfig | undefined {
  for (const line of stdout.split('\n')) {
    if (!line.startsWith('{')) continue
    const record = JSON.parse(line) as { type?: string; event?: { type?: string; data?: { header?: { config?: HeaderConfig } } } }
    if (record.type === 'session_event' && record.event?.type === 'request/header') return record.event.data?.header?.config
  }
  return undefined
}

describe.skipIf(!hasKey)('headless-agent on the default provider', () => {
  it('answers on the default route through OpenRouter', async () => {
    const { stdout } = await runLoaderSmoke({
      label: 'headless-agent OpenRouter default',
      tempDirPrefix: 'headless-agent-openrouter-',
      binScript,
      libBinScript: binScript,
      configPath,
      binArgs: [configPath, 'Reply with exactly the word pong and nothing else. Do not use tools.'],
      tsconfigPath,
      processTimeoutMs: 120_000,
    })
    expect(requestRoute(stdout)).toMatchObject({ provider: 'openrouter', model: 'qwen/qwen4-max' })
    const result = JSON.parse(stdout.trim().split('\n').at(-1) ?? '{}') as { output?: string }
    expect(result.output?.toLowerCase()).toContain('pong')
  }, 135_000)
})
