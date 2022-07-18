import { makeInputParameters } from '../../src/input-parameters'
import { generateLaunchConfig } from '../../src/octopus-cli-wrapper'

test('no parameters', () => {
  const launchInfo = generateLaunchConfig({ parameters: makeInputParameters(), env: {} }, console)
  expect(launchInfo.args).toEqual(['run-runbook'])
})

test('all the parameters', () => {
  const i = makeInputParameters({
    project: 'projectZ',
    apiKey: 'API FOOBAR',
    proxy: 'some-proxy',
    proxyPassword: 'some-proxy-pass',
    proxyUsername: 'some-proxy-user',
    server: 'http://octopusServer',
    space: 'Space-61',
    environments: 'hello,world',
    runbook: 'some-runbook',
    variables: ['testing', 'variables']
  })

  const launchInfo = generateLaunchConfig({ parameters: i, env: {} }, console)
  expect(launchInfo.env).toEqual({
    OCTOPUS_CLI_API_KEY: 'API FOOBAR',
    OCTOPUS_CLI_SERVER: 'http://octopusServer'
  })

  expect(launchInfo.args).toEqual([
    'run-runbook',
    '--proxy=some-proxy',
    '--proxyUser=some-proxy-user',
    '--proxyPass=some-proxy-pass',
    '--space=Space-61',
    '--project=projectZ',
    '--runbook=some-runbook',
    '--environment=hello',
    '--environment=world',
    '--variable=testing',
    '--variable=variables'
  ])
})

test('all the parameters where env has the values', () => {
  const i = makeInputParameters({
    project: 'projectZ',
    environments: 'hello,world',
    runbook: 'some-runbook',
    variables: ['testing', 'variables']
  })

  const env = {
    OCTOPUS_API_KEY: 'API FOOBAR',
    OCTOPUS_HOST: 'http://octopusServer',
    OCTOPUS_SPACE: 'Space-61',
    OCTOPUS_PROXY: 'some-proxy',
    OCTOPUS_PROXY_USERNAME: 'some-proxy-user',
    OCTOPUS_PROXY_PASSWORD: 'some-proxy-pass'
  }

  const launchInfo = generateLaunchConfig({ parameters: i, env: env }, console)
  expect(launchInfo.env).toEqual({
    OCTOPUS_CLI_API_KEY: 'API FOOBAR',
    OCTOPUS_CLI_SERVER: 'http://octopusServer'
  })

  expect(launchInfo.args).toEqual([
    'run-runbook',
    '--proxy=some-proxy',
    '--proxyUser=some-proxy-user',
    '--proxyPass=some-proxy-pass',
    '--space=Space-61',
    '--project=projectZ',
    '--runbook=some-runbook',
    '--environment=hello',
    '--environment=world',
    '--variable=testing',
    '--variable=variables'
  ])
})
