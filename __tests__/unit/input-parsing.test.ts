import { getInputParameters } from '../../src/input-parameters'

test('get input parameters', () => {
  const inputParameters = getInputParameters()
  expect(inputParameters).toBeDefined()
  expect(inputParameters.environments).toBeDefined()
  expect(inputParameters.environments[0]).toBe('Dev')
  expect(inputParameters.environments[1]).toBe('Staging')
  expect(inputParameters.variables).toBeDefined()
  expect(inputParameters.variables?.['foo']).toBe('quux')
  expect(inputParameters.variables?.['bar']).toBe('xyzzy')
})
