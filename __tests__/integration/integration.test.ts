import {
  Client,
  ClientConfiguration,
  DeploymentEnvironment,
  DeploymentProcessRepository,
  EnvironmentRepository,
  GuidedFailureMode,
  LifecycleRepository,
  Logger,
  PackageRequirement,
  Project,
  ProjectGroupRepository,
  ProjectRepository,
  RunbookEnvironmentScope,
  RunbookProcessRepository,
  RunbookRepository,
  RunbookRetentionUnit,
  RunbookSnapshotRepository,
  RunCondition,
  RunConditionForAction,
  ServerTask,
  ServerTaskWaiter,
  StartTrigger,
  TenantedDeploymentMode
} from '@octopusdeploy/api-client'
import { randomBytes } from 'crypto'
import { setOutput } from '@actions/core'
import { CaptureOutput } from '../test-helpers'
import { InputParameters } from '../../src/input-parameters'
import { runRunbookFromInputs } from '../../src/api-wrapper'

const apiClientConfig: ClientConfiguration = {
  userAgentApp: 'Test',
  apiKey: process.env.OCTOPUS_TEST_API_KEY || 'API-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  instanceURL: process.env.OCTOPUS_TEST_URL || 'http://localhost:8050'
}

describe('integration tests', () => {
  jest.setTimeout(100000)

  const runId = randomBytes(16).toString('hex')

  const localProjectName = `project${runId}`
  const spaceName = process.env.OCTOPUS_TEST_SPACE || 'Default'

  const standardInputParameters: InputParameters = {
    server: apiClientConfig.instanceURL,
    apiKey: apiClientConfig.apiKey,
    space: spaceName,
    project: localProjectName,
    runbook: 'TestRunbook',
    environments: ['Dev', 'Staging Demo']
  }

  let apiClient: Client
  let project: Project

  beforeAll(async () => {
    apiClient = await Client.create(apiClientConfig)

    const projectGroup = (await new ProjectGroupRepository(apiClient, standardInputParameters.space).list({ take: 1 }))
      .Items[0]
    if (!projectGroup) throw new Error("can't find first projectGroup")

    let devEnv: DeploymentEnvironment
    let stagingEnv: DeploymentEnvironment
    const envRepository = new EnvironmentRepository(apiClient, standardInputParameters.space)
    let envs = await envRepository.list({ partialName: 'Dev' })
    if (envs.Items.filter(e => e.Name === 'Dev').length === 1) {
      devEnv = envs.Items.filter(e => e.Name === 'Dev')[0]
    } else {
      devEnv = await envRepository.create({ Name: 'Dev' })
    }
    envs = await envRepository.list({ partialName: 'Staging Demo' })
    if (envs.Items.filter(e => e.Name === 'Staging Demo').length === 1) {
      stagingEnv = envs.Items.filter(e => e.Name === 'Staging Demo')[0]
    } else {
      stagingEnv = await envRepository.create({ Name: 'Staging Demo' })
    }

    const lifecycleRepository = new LifecycleRepository(apiClient, standardInputParameters.space)
    const lifecycle = (await lifecycleRepository.list({ take: 1 })).Items[0]
    if (!lifecycle) throw new Error("Can't find first lifecycle")
    if (lifecycle.Phases.length === 0) {
      lifecycle.Phases.push({
        Id: 'test',
        Name: 'Testing',
        OptionalDeploymentTargets: [devEnv.Id, stagingEnv.Id],
        AutomaticDeploymentTargets: [],
        MinimumEnvironmentsBeforePromotion: 1,
        IsOptionalPhase: false
      })
      await lifecycleRepository.modify(lifecycle)
    }

    const projectRepository = new ProjectRepository(apiClient, standardInputParameters.space)
    project = await projectRepository.create({
      Name: localProjectName,
      LifecycleId: lifecycle.Id,
      ProjectGroupId: projectGroup.Id
    })

    const deploymentProcessRepository = new DeploymentProcessRepository(apiClient, standardInputParameters.space)
    const deploymentProcess = await deploymentProcessRepository.get(project)
    deploymentProcess.Steps = [
      {
        Condition: RunCondition.Success,
        PackageRequirement: PackageRequirement.LetOctopusDecide,
        StartTrigger: StartTrigger.StartAfterPrevious,
        Id: '',
        Name: `step1-${runId}`,
        Properties: { 'Octopus.Action.TargetRoles': 'deploy' },
        Actions: [
          {
            Id: '',
            Name: 'Run a Script',
            ActionType: 'Ocotpus.Script',
            Notes: null,
            IsDisabled: false,
            CanBeUsedForProjectVersioning: false,
            IsRequired: false,
            WorkerPoolId: null,
            Container: {
              Image: null,
              FeedId: null
            },
            WorkerPoolVariable: '',
            Environments: [],
            ExcludedEnvironments: [],
            Channels: [],
            TenantTags: [],
            Packages: [],
            Condition: RunConditionForAction.Success,
            Properties: {
              'Octopus.Action.RunOnServer': 'false',
              'Octopus.Action.Script.ScriptSource': 'Inline',
              'Octopus.Action.Script.Syntax': 'Bash',
              'Octopus.Action.Script.ScriptBody': "ehco 'hello'"
            }
          }
        ]
      }
    ]
    await deploymentProcessRepository.update(project, deploymentProcess)

    const runbookRepository = new RunbookRepository(apiClient, standardInputParameters.space, project)
    const runbook = await runbookRepository.create({
      ProjectId: project.Id,
      Description: 'Test Run book',
      DefaultGuidedFailureMode: GuidedFailureMode.EnvironmentDefault,
      Name: 'TestRunbook',
      EnvironmentScope: RunbookEnvironmentScope.All,
      MultiTenancyMode: TenantedDeploymentMode.TenantedOrUntenanted,
      RunRetentionPolicy: {
        QuantityToKeep: 1,
        ShouldKeepForever: false
      }
    })

    const runbookProcessRepository = new RunbookProcessRepository(apiClient, standardInputParameters.space, project)
    const runbookProcess = await runbookProcessRepository.get(runbook)
    runbookProcess.Steps = [
      {
        Condition: RunCondition.Success,
        PackageRequirement: PackageRequirement.LetOctopusDecide,
        StartTrigger: StartTrigger.StartAfterPrevious,
        Id: '',
        Name: `Run a Script`,
        Properties: { 'Octopus.Action.TargetRoles': 'deploy' },
        Actions: [
          {
            Id: '',
            Name: 'Run a Script',
            ActionType: 'Octopus.Script',
            Notes: null,
            IsDisabled: false,
            WorkerPoolId: null,
            Container: {
              Image: null,
              FeedId: null
            },
            WorkerPoolVariable: null,
            Environments: [],
            ExcludedEnvironments: [],
            Channels: [],
            TenantTags: [],
            CanBeUsedForProjectVersioning: false,
            Packages: [],
            Properties: {
              'Octopus.Action.RunOnServer': 'false',
              'Octopus.Action.Script.ScriptSource': 'Inline',
              'Octopus.Action.Script.Syntax': 'Bash',
              'Octopus.Action.Script.ScriptBody': "ehco 'hello'"
            },
            IsRequired: false
          }
        ]
      }
    ]
    await runbookProcessRepository.update(runbookProcess)

    const runbookSnapshotRepository = new RunbookSnapshotRepository(apiClient, standardInputParameters.space, project)
    await runbookSnapshotRepository.create(runbook, `Snapshot${runId}`, true)
  })

  afterAll(async () => {
    if (process.env.GITHUB_ACTIONS) {
      setOutput('gha_selftest_project_name', standardInputParameters.project)
      setOutput('gha_selftest_runbook', standardInputParameters.runbook)
    } else {
      if (project) {
        const projectRepository = new ProjectRepository(apiClient, standardInputParameters.space)
        await projectRepository.del(project)
      }
    }
  })

  test('can run runbook', async () => {
    const output = new CaptureOutput()

    const logger: Logger = {
      debug: message => output.debug(message),
      info: message => output.info(message),
      warn: message => output.warn(message),
      error: (message, err) => {
        if (err !== undefined) {
          output.error(err.message)
        } else {
          output.error(message)
        }
      }
    }

    const config: ClientConfiguration = {
      userAgentApp: 'Test',
      instanceURL: apiClientConfig.instanceURL,
      apiKey: apiClientConfig.apiKey,
      logging: logger
    }

    const client = await Client.create(config)

    const result = await runRunbookFromInputs(client, standardInputParameters)

    // The first release in the project, so it should always have 0.0.1
    expect(result.length).toBe(2)
    expect(result[0].serverTaskId).toContain('ServerTasks-')

    expect(output.getAllMessages()).toContain(`[INFO] 🎉 2 Runbook runs queued successfully!`)

    // wait for the deployment or the teardown will fail
    const waiter = new ServerTaskWaiter(client, standardInputParameters.space)
    await waiter.waitForServerTasksToComplete(
      result.map(r => r.serverTaskId),
      1000,
      60000,
      (serverTask: ServerTask): void => {
        console.log(`Waiting for task ${serverTask.Id}. Current status: ${serverTask.State}`)
      }
    )
  })
})
