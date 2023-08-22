import { getBooleanInput, getInput, getMultilineInput } from '@actions/core'
import { PromptedVariableValues } from '@octopusdeploy/api-client'

const EnvironmentVariables = {
  URL: 'OCTOPUS_URL',
  ApiKey: 'OCTOPUS_API_KEY',
  AccessToken: 'OCTOPUS_ACCESS_TOKEN',
  Space: 'OCTOPUS_SPACE'
} as const

export interface InputParameters {
  project: string
  runbook: string
  environments: string[]
  tenants?: string[]
  tenantTags?: string[]
  useGuidedFailure?: boolean
  variables?: PromptedVariableValues
  server: string
  apiKey?: string
  accessToken?: string
  space: string
}

export function getInputParameters(): InputParameters {
  let variablesMap: PromptedVariableValues | undefined = undefined
  const variables = getMultilineInput('variables').map(p => p.trim()) || undefined
  if (variables) {
    variablesMap = {}
    for (const variable of variables) {
      const variableMap = variable.split(':').map(x => x.trim())
      variablesMap[variableMap[0]] = variableMap[1]
    }
  }

  const parameters = {
    server: getInput('server') || process.env[EnvironmentVariables.URL] || '',
    apiKey: getInput('api_key') || process.env[EnvironmentVariables.ApiKey],
    accessToken: getInput('access_token') || process.env[EnvironmentVariables.AccessToken],
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
      "The Octopus instance URL is required, please specify explicitly through the 'server' input or set the OCTOPUS_URL environment variable."
    )
  }

  if (!parameters.apiKey && !parameters.accessToken)
    errors.push(
      "One of API Key or Access Token are required, please specify explicitly through the 'api_key'/'access_token' inputs or set the OCTOPUS_API_KEY/OCTOPUS_ACCESS_TOKEN environment variable."
    )

  if (parameters.apiKey && parameters.accessToken) errors.push('Only one of API Key or Access Token can be supplied.')

  if (!parameters.space) {
    errors.push(
      "The Octopus space name is required, please specify explicitly through the 'space' input or set the OCTOPUS_SPACE environment variable."
    )
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'))
  }

  return parameters
}
