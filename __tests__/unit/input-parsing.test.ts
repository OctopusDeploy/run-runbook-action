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

test('get tenant input parameters', () => {
  process.env['INPUT_TENANTS'] = ' Customer A \n Customer B '
  process.env['INPUT_TENANT_TAGS'] = 'Region/Australia'
  try {
    const inputParameters = getInputParameters()
    expect(inputParameters.tenants).toEqual(['Customer A', 'Customer B'])
    expect(inputParameters.tenantTags).toEqual(['Region/Australia'])
  } finally {
    delete process.env['INPUT_TENANTS']
    delete process.env['INPUT_TENANT_TAGS']
  }
})
