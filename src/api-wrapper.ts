import { InputParameters } from './input-parameters'
import {
  Client,
  CreateRunbookRunCommandV1,
  EnvironmentRepository,
  RunbookRunRepository,
  TenantRepository,
  Tenant,
  ResourceCollection
} from '@octopusdeploy/api-client'

export interface RunbookRunResult {
  serverTaskId: string
  environmentName: string
  tenantName: string | null
}

export async function runRunbookFromInputs(client: Client, parameters: InputParameters): Promise<RunbookRunResult[]> {
  client.info('🐙 Running runbooks in Octopus Deploy...')

  const command: CreateRunbookRunCommandV1 = {
    spaceName: parameters.space,
    ProjectName: parameters.project,
    RunbookName: parameters.runbook,
    EnvironmentNames: parameters.environments,
    Tenants: parameters.tenants,
    TenantTags: parameters.tenantTags,
    UseGuidedFailure: parameters.useGuidedFailure,
    Variables: parameters.variables
  }

  const runbookRunRepository = new RunbookRunRepository(client, parameters.space)
  const response = await runbookRunRepository.create(command)

  client.info(
    `🎉 ${response.RunbookRunServerTasks.length} Runbook run${
      response.RunbookRunServerTasks.length > 1 ? 's' : ''
    } queued successfully!`
  )

  if (response.RunbookRunServerTasks.length === 0) {
    throw new Error('Expected at least one deployment to be queued.')
  }
  if (
    response.RunbookRunServerTasks[0].ServerTaskId === null ||
    response.RunbookRunServerTasks[0].ServerTaskId === undefined
  ) {
    throw new Error('Server task id was not deserialized correctly.')
  }

  const runIds = response.RunbookRunServerTasks.map(x => x.RunbookRunId)

  const runs = await runbookRunRepository.list({ ids: runIds, take: runIds.length })

  const envIds = runs.Items.map(d => d.EnvironmentId)
  const envRepository = new EnvironmentRepository(client, parameters.space)
  const environments = await envRepository.list({ ids: envIds, take: envIds.length })

  let tenants: ResourceCollection<Tenant>
  if (
    (parameters.tenants && parameters.tenants.length > 0) ||
    (parameters.tenantTags && parameters.tenantTags.length > 0)
  ) {
    const tenantIds = runs.Items.map(d => d.TenantId || '')
    const tenantRepository = new TenantRepository(client, parameters.space)
    tenants = await tenantRepository.list({ ids: tenantIds, take: tenantIds.length })
  }

  const results = response.RunbookRunServerTasks.map(x => {
    return {
      serverTaskId: x.ServerTaskId,
      environmentName: environments.Items.filter(
        e => e.Id === runs.Items.filter(d => d.TaskId === x.ServerTaskId)[0].EnvironmentId
      )[0].Name,
      tenantName: tenants
        ? tenants.Items.filter(t => t.Id === runs.Items.filter(d => d.TaskId === x.ServerTaskId)[0].TenantId)[0].Name
        : null
    }
  })

  return results
}
