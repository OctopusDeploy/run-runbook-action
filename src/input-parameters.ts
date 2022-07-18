import { getInput, getMultilineInput } from '@actions/core'

export interface InputParameters {
  project: string
  runbook: string
  environments: string
  variables: string[]
  apiKey: string
  proxy: string
  proxyPassword: string
  proxyUsername: string
  server: string
  space: string
}

export function getInputParameters(): InputParameters {
  return {
    project: getInput('project'),
    runbook: getInput('runbook'),
    environments: getInput('environments'),
    variables: getMultilineInput('variables'),
    apiKey: getInput('api_key'),
    proxy: getInput('proxy'),
    proxyPassword: getInput('proxy_password'),
    proxyUsername: getInput('proxy_username'),
    server: getInput('server'),
    space: getInput('space')
  }
}

export function makeInputParameters(override?: Partial<InputParameters>): InputParameters {
  const template: InputParameters = {
    project: '',
    runbook: '',
    environments: '',
    variables: [],
    apiKey: '',
    proxy: '',
    proxyPassword: '',
    proxyUsername: '',
    server: '',
    space: ''
  }

  if (override) {
    Object.assign(template, override)
  }
  return template
}
