import { getBooleanInput, getInput, getMultilineInput } from '@actions/core'

const EnvironmentVariables = {
  URL: 'OCTOPUS_URL',
  ApiKey: 'OCTOPUS_API_KEY',
  Space: 'OCTOPUS_SPACE'
} as const

export interface InputParameters {
  project: string
  runbook: string
  environments: string[]
  tenants?: string[]
  tenantTags?: string[]
  useGuidedFailure?: boolean
  variables?: Map<string, string>
  server: string
  apiKey: string
  space: string
}

export function getInputParameters(): InputParameters {
  let variablesMap: Map<string, string> | undefined = undefined
  const variables = getMultilineInput('variables').map(p => p.trim()) || undefined
  if (variables) {
    variablesMap = new Map()
    for (const variable of variables) {
      const variableMap = variable.split(':').map(x => x.trim())
      variablesMap?.set(variableMap[0], variableMap[1])
    }
  }

  const parameters = {
    server: getInput('server') || process.env[EnvironmentVariables.URL] || '',
    apiKey: getInput('api_key') || process.env[EnvironmentVariables.ApiKey] || '',
    space: getInput('space') || process.env[EnvironmentVariables.Space] || '',
    project: getInput('project', { required: true }),
    runbook: getInput('runbook', { required: true }),
    environments: getMultilineInput('environments', { required: true }).map(p => p.trim()),
    tenants: getMultilineInput('tenants').map(p => p.trim()) || undefined,
    tenantTags: getMultilineInput('tenant_tags').map(p => p.trim()) || undefined,
    useGuidedFailure: getBooleanInput('use_guided_failure') || undefined,
    variables: variablesMap
  }

  const errors: string[] = []
  if (!parameters.server) {
    errors.push(
      "The Octopus instance URL is required, please specify explictly through the 'server' input or set the OCTOPUS_URL environment variable."
    )
  }
  if (!parameters.apiKey) {
    errors.push(
      "The Octopus API Key is required, please specify explictly through the 'api_key' input or set the OCTOPUS_API_KEY environment variable."
    )
  }
  if (!parameters.space) {
    errors.push(
      "The Octopus space name is required, please specify explictly through the 'space' input or set the OCTOPUS_SPACE environment variable."
    )
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'))
  }

  return parameters
}
