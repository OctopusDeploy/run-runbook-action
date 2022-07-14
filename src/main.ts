import {getInputParameters} from './input-parameters'
import {info, setFailed, warning} from '@actions/core'
import {OctopusCliWrapper} from './octopus-cli-wrapper'

async function run(): Promise<void> {
  try {
    const wrapper = new OctopusCliWrapper(
      getInputParameters(),
      process.env,
      msg => info(msg),
      msg => warning(msg)
    )
    await wrapper.runRunbook()
  } catch (e: unknown) {
    if (e instanceof Error) {
      setFailed(e)
    }
  }
}

run()
