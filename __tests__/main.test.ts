import * as inputs from '../src/input-parameters'
import * as octopus from '../src/run-runbook'

describe('inputs', () => {
  it('successfully get input parameters', async () => {
    const inputParameters = inputs.get()
    expect(inputParameters != undefined)
  }, 100000)
})

describe('releases', () => {
  it('successfully runs a runbook', async () => {
    const inputParameters = inputs.get()
    await octopus.runRunbook(inputParameters)
  }, 100000)
})
