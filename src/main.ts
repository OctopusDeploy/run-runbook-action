import * as core from '@actions/core'
import * as octopus from './run-runbook'
import * as inputs from '../src/input-parameters'

async function run(): Promise<void> {
  try {
    const inputParameters = inputs.get()
    await octopus.runRunbook(inputParameters)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
