import { Client } from '@octopusdeploy/api-client'
import { runRunbookFromInputs } from '../../src/api-wrapper'
import { InputParameters } from '../../src/input-parameters'

// A stand-in for the Octopus client. It records the command sent to the executions API
// and answers the lookups the action makes after the runs are queued.
function fakeClient(): { client: Client; sent: Record<string, unknown>[] } {
  const sent: Record<string, unknown>[] = []
  const fake = {
    info: () => undefined,
    debug: () => undefined,
    error: () => undefined,
    getServerInformation: async () => ({ version: '2024.1.0' }),
    doCreate: async (_path: string, command: Record<string, unknown>) => {
      sent.push(command)
      return { RunbookRunServerTasks: [{ RunbookRunId: 'RunbookRuns-1', ServerTaskId: 'ServerTasks-1' }] }
    },
    request: async (path: string) => {
      if (path.includes('/runbookRuns')) {
        return {
          Items: [
            { Id: 'RunbookRuns-1', TaskId: 'ServerTasks-1', EnvironmentId: 'Environments-1', TenantId: 'Tenants-1' }
          ]
        }
      }
      if (path.includes('/environments')) {
        return { Items: [{ Id: 'Environments-1', Name: 'Dev' }] }
      }
      if (path.includes('/tenants')) {
        return { Items: [{ Id: 'Tenants-1', Name: 'Customer A' }] }
      }
      throw new Error(`Unexpected request: ${path}`)
    }
  }
  return { client: fake as unknown as Client, sent }
}

const parameters: InputParameters = {
  server: 'https://octopus.example.com',
  apiKey: 'API-TEST',
  space: 'Default',
  project: 'Test Project',
  runbook: 'Test Runbook',
  environments: ['Dev'],
  tenants: ['Customer A']
}

test('runs a database runbook against the given tenant', async () => {
  const { client, sent } = fakeClient()

  const result = await runRunbookFromInputs(client, parameters)

  expect(sent[0].Tenants).toEqual(['Customer A'])
  expect(result).toEqual([{ serverTaskId: 'ServerTasks-1', environmentName: 'Dev', tenantName: 'Customer A' }])
})

test('runs a Git runbook against the given tenant', async () => {
  const { client, sent } = fakeClient()

  const result = await runRunbookFromInputs(client, { ...parameters, gitRef: 'refs/heads/main' })

  expect(sent[0].Tenants).toEqual(['Customer A'])
  expect(sent[0].gitRef).toBe('refs/heads/main')
  expect(result[0].tenantName).toBe('Customer A')
})
