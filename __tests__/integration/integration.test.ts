import {
  Client,
  ClientConfiguration,
  DeploymentEnvironment,
  EnvironmentRepository,
  ExecutionWaiter,
  Logger,
  Repository,
  ServerTaskDetails
} from '@octopusdeploy/api-client'
import { randomBytes } from 'crypto'
import { CleanupHelper } from './cleanup-helper'
import {
  GuidedFailureMode,
  PackageRequirement,
  RunbookEnvironmentScope,
  RunbookSnapshotResource,
  RunCondition,
  RunConditionForAction,
  StartTrigger,
  TenantedDeploymentMode
} from '@octopusdeploy/message-contracts'
import { setOutput } from '@actions/core'
import { CaptureOutput } from '../test-helpers'
import { InputParameters } from '../../src/input-parameters'
import { runRunbookFromInputs } from '../../src/api-wrapper'

const apiClientConfig: ClientConfiguration = {
  userAgentApp: 'Test',
  apiKey: process.env.OCTOPUS_TEST_API_KEY || 'API-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  instanceURL: process.env.OCTOPUS_TEST_URL || 'http://localhost:8050',
  space: process.env.OCTOPUS_TEST_SPACE || 'Default'
}

describe('integration tests', () => {
  jest.setTimeout(100000)

  const globalCleanup = new CleanupHelper()
  const runId = randomBytes(16).toString('hex')

  const localProjectName = `project${runId}`

  const standardInputParameters: InputParameters = {
    server: apiClientConfig.instanceURL,
    apiKey: apiClientConfig.apiKey,
    space: apiClientConfig.space || 'Default',
    project: localProjectName,
    runbook: 'TestRunbook',
    environments: ['Dev', 'Staging Demo']
  }

  let apiClient: Client
  beforeAll(async () => {
    apiClient = await Client.create({ autoConnect: true, ...apiClientConfig })

    const repository = new Repository(apiClient)

    const projectGroup = (await repository.projectGroups.all())[0]
    if (!projectGroup) throw new Error("can't find first projectGroup")

    let devEnv: DeploymentEnvironment
    let stagingEnv: DeploymentEnvironment
    const envRepository = new EnvironmentRepository(apiClient, apiClientConfig.space || 'Default')
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

    const lifeCycle = (await repository.lifecycles.all())[0]
    if (!lifeCycle) throw new Error("Can't find first lifecycle")
    if (lifeCycle.Phases.length === 0) {
      lifeCycle.Phases.push({
        Id: 'test',
        Name: 'Testing',
        OptionalDeploymentTargets: [devEnv.Id, stagingEnv.Id],
        AutomaticDeploymentTargets: [],
        MinimumEnvironmentsBeforePromotion: 1,
        IsOptionalPhase: false
      })
      await repository.lifecycles.modify(lifeCycle)
    }

    const project = await repository.projects.create({
      Name: localProjectName,
      LifecycleId: lifeCycle.Id,
      ProjectGroupId: projectGroup.Id
    })

    const deploymentProcess = await repository.deploymentProcesses.get(project.DeploymentProcessId, undefined)
    deploymentProcess.Steps = [
      {
        Condition: RunCondition.Success,
        Links: {},
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
            },
            Links: {}
          }
        ]
      }
    ]
    await repository.deploymentProcesses.saveToProject(project, deploymentProcess)

    const runbook = await repository.runbooks.create({
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

    globalCleanup.add(async () => repository.runbooks.del(runbook))

    const runbookProcess = await repository.runbookProcess.get(runbook.RunbookProcessId, undefined)
    runbookProcess.Steps = [
      {
        Condition: RunCondition.Success,
        Links: {},
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
            Links: {},
            IsRequired: false
          }
        ]
      }
    ]
    await repository.runbookProcess.save(runbookProcess)
    let snapshot = {} as RunbookSnapshotResource
    snapshot.ProjectId = project.Id
    snapshot.Name = `Snapshot${runId}`
    snapshot.RunbookId = runbook.Id
    snapshot = await repository.runbookSnapshots.create(snapshot, {
      publish: true
    })

    globalCleanup.add(async () => {
      // Added some time to wait for the runbook to finish running before cleanup
      return new Promise(r => setTimeout(r, 2500))
    })
  })

  afterAll(async () => {
    if (process.env.GITHUB_ACTIONS) {
      setOutput('gha_selftest_project_name', standardInputParameters.project)
      setOutput('gha_selftest_runbook', standardInputParameters.runbook)
    } else {
      await globalCleanup.cleanup()
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
    const waiter = new ExecutionWaiter(client, standardInputParameters.space)
    await waiter.waitForExecutionsToComplete(
      result.map(r => r.serverTaskId),
      1000,
      60000,
      (serverTaskDetails: ServerTaskDetails): void => {
        console.log(
          `Waiting for task ${serverTaskDetails.Task.Id}. Current status: ${serverTaskDetails.Task.State}, completed: ${serverTaskDetails.Progress.ProgressPercentage}%`
        )
      }
    )
  })
})
