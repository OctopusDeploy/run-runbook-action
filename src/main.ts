import { getInputParameters } from './input-parameters'
import { info, setFailed, warning } from '@actions/core'
import { CliInputs, runRunbook } from './octopus-cli-wrapper'
import { CliOutput } from './cli-util'

// GitHub actions entrypoint
async function run(): Promise<void> {
  try {
    const inputs: CliInputs = { parameters: getInputParameters(), env: process.env }
    const outputs: CliOutput = { info: s => info(s), warn: s => warning(s) }

    await runRunbook(inputs, outputs, 'octo')
  } catch (e: unknown) {
    if (e instanceof Error) {
      setFailed(e)
    }
  }
}

run()
