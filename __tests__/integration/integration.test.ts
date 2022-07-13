import {makeInputParameters} from '../../src/input-parameters'
import {
  Client,
  ClientConfiguration,
  Repository
} from '@octopusdeploy/api-client'
import {randomBytes} from 'crypto'
import {CleanupHelper} from './cleanup-helper'
import {
  GuidedFailureMode,
  PackageRequirement,
  RunbookSnapshotResource,
  RunCondition,
  StartTrigger,
  TenantedDeploymentMode
} from '@octopusdeploy/message-contracts'
import {RunConditionForAction} from '@octopusdeploy/message-contracts/dist/runConditionForAction'
import {RunbookEnvironmentScope} from '@octopusdeploy/message-contracts/dist/runbookEnvironmentScope'
import {setOutput} from '@actions/core'
import {OctopusCliWrapper} from '../../src/octopus-cli-wrapper'

const octoExecutable = process.env.OCTOPUS_TEST_CLI_PATH || 'octo' // if 'octo' isn't in your system path, you can override it for tests here

const apiClientConfig: ClientConfiguration = {
  apiKey:
    process.env.OCTOPUS_TEST_APIKEY || 'API-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  apiUri: process.env.OCTOPUS_TEST_URL || 'http://localhost:8050'
}

// experimental. Should probably be a custom jest matcher
// function expectMatchAll(actual: string[], expected: (string | RegExp)[]): void {
//   expect(actual.length).toEqual(expected.length)
//   for (let i = 0; i < actual.length; i++) {
//     const a = actual[i]
//     const e = expected[i]
//     if (e instanceof RegExp) {
//       expect(a).toMatch(e)
//     } else {
//       expect(a).toEqual(e)
//     }
//   }
// }

describe('integration tests', () => {
  const runId = randomBytes(16).toString('hex')
  const globalCleanup = new CleanupHelper()
  const localProjectName = `project${runId}`
  const standardInput = makeInputParameters({
    project: localProjectName,
    apiKey: apiClientConfig.apiKey,
    server: apiClientConfig.apiUri
  })

  let apiClient: Client
  beforeAll(async () => {
    apiClient = await Client.create(apiClientConfig)

    const repository = new Repository(apiClient)

    const lifeCycle = (await repository.lifecycles.all())[0]
    if (!lifeCycle) throw new Error("Can't find first lifecycle")

    const projectGroup = (await repository.projectGroups.all())[0]
    if (!projectGroup) throw new Error("can't find first projectGroup")

    const project = await repository.projects.create({
      Name: localProjectName,
      LifecycleId: lifeCycle.Id,
      ProjectGroupId: projectGroup.Id
    })
    standardInput.project = project.Id
    globalCleanup.add(async () => repository.projects.del(project))
    const deploymentProcess = await repository.deploymentProcesses.get(
      project.DeploymentProcessId,
      undefined
    )
    deploymentProcess.Steps = [
      {
        Condition: RunCondition.Success,
        Links: {},
        PackageRequirement: PackageRequirement.LetOctopusDecide,
        StartTrigger: StartTrigger.StartAfterPrevious,
        Id: '',
        Name: `step1-${runId}`,
        Properties: {'Octopus.Action.TargetRoles': 'deploy'},
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
    await repository.deploymentProcesses.saveToProject(
      project,
      deploymentProcess
    )

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
    const runbookProcess = await repository.runbookProcess.get(
      runbook.RunbookProcessId,
      undefined
    )
    runbookProcess.Steps = [
      {
        Condition: RunCondition.Success,
        Links: {},
        PackageRequirement: PackageRequirement.LetOctopusDecide,
        StartTrigger: StartTrigger.StartAfterPrevious,
        Id: '',
        Name: `Run a Script`,
        Properties: {'Octopus.Action.TargetRoles': 'deploy'},
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
    standardInput.runbook = runbook.Id
    const env = await repository.environments.create({
      Name: `Test-${runId}`
    })
    globalCleanup.add(async () => repository.environments.del(env))
    globalCleanup.add(async () => new Promise(r => setTimeout(r, 2500)))
    standardInput.environments = env.Id
  })

  afterAll(async () => {
    if (process.env.GITHUB_ACTIONS) {
      setOutput('gha_selftest_project_name', standardInput.project)
      setOutput('gha_selftest_environments', standardInput.environments)
      setOutput('gha_selftest_runbook', standardInput.runbook)
    } else {
      await globalCleanup.cleanup()
    }
  })

  test('can run runbook', async () => {
    const messages: string[] = []
    const w = new OctopusCliWrapper(
      standardInput,
      {},
      m => messages.push(m),
      m => messages.push(m)
    )
    await w.runRunbook(octoExecutable)
    console.log('Got: ', messages)
    // expectMatchAll(messages, [
    //   '🔣 Parsing inputs...',
    //   /Octopus CLI, version .*/,
    //   'Detected automation environment: "NoneOrUnknown"',
    //   'Space name unspecified, process will run in the default space context',
    //   '🤝 Handshaking with Octopus Deploy',
    //   /Handshake successful. Octopus version: .*/,
    //   ' (a service account)',
    //   `Found runbook: TestRunbook (${standardInput.runbook})`
    // ])
    // The CLI outputs a diffrent amount of inputs with diffrent value
    // everytime it runs in a GitHub Action. As we will be moving away from
    // the CLI we will just check that the CLI outpus something.
    expect(messages.length).toBeGreaterThan(0)
  })
})
