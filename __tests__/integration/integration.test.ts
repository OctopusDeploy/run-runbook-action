import { makeInputParameters } from '../../src/input-parameters'
import { Client, ClientConfiguration, Repository } from '@octopusdeploy/api-client'
import { randomBytes } from 'crypto'
import { CleanupHelper } from './cleanup-helper'
import {
  GuidedFailureMode,
  PackageRequirement,
  RunbookSnapshotResource,
  RunCondition,
  StartTrigger,
  TenantedDeploymentMode
} from '@octopusdeploy/message-contracts'
import { RunConditionForAction } from '@octopusdeploy/message-contracts/dist/runConditionForAction'
import { RunbookEnvironmentScope } from '@octopusdeploy/message-contracts/dist/runbookEnvironmentScope'
import { setOutput } from '@actions/core'
import { runRunbook } from '../../src/octopus-cli-wrapper'
import { CaptureOutput } from '../test-helpers'
import { platform, tmpdir } from 'os'
import { chmodSync, mkdirSync, rmSync, writeFileSync } from 'fs'
import { join as pathJoin } from 'path'

const octoExecutable = process.env.OCTOPUS_TEST_CLI_PATH || 'octo' // if 'octo' isn't in your system path, you can override it for tests here

const isWindows = platform().includes('win')

const apiClientConfig: ClientConfiguration = {
  apiKey: process.env.OCTOPUS_TEST_APIKEY || 'API-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  apiUri: process.env.OCTOPUS_TEST_URL || 'http://localhost:8050'
}

// experimental. Should probably be a custom jest matcher
function expectMatchAll(actual: string[], expected: (string | RegExp)[]) {
  for (let i = 0; i < Math.min(expected.length, actual.length); i++) {
    const a = actual[i]
    const e = expected[i]
    if (e instanceof RegExp) {
      expect(a).toMatch(e)
    } else {
      expect(a).toEqual(e)
    }
  }
  expect(actual.length).toEqual(expected.length)
}

describe('integration tests', () => {
  const runId = randomBytes(16).toString('hex')

  const globalCleanup = new CleanupHelper()

  const localProjectName = `project${runId}`
  const standardInputParameters = makeInputParameters({
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
    standardInputParameters.project = project.Id
    globalCleanup.add(async () => repository.projects.del(project))
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
    standardInputParameters.runbook = runbook.Id
    const env = await repository.environments.create({
      Name: `Test-${runId}`
    })
    globalCleanup.add(async () => repository.environments.del(env))
    standardInputParameters.environments = env.Id

    globalCleanup.add(async () => {
      // Added some time to wait for the runbook to finish running before cleanup
      return new Promise(r => setTimeout(r, 2500))
    })
  })

  afterAll(async () => {
    if (process.env.GITHUB_ACTIONS) {
      setOutput('gha_selftest_project_name', standardInputParameters.project)
      setOutput('gha_selftest_environments', standardInputParameters.environments)
      setOutput('gha_selftest_runbook', standardInputParameters.runbook)
    } else {
      await globalCleanup.cleanup()
    }
  })

  test('can run runbook', async () => {
    const output = new CaptureOutput()
    await runRunbook({ parameters: standardInputParameters, env: {} }, output, octoExecutable)

    console.log('Got: ', output.getAllMessages())
    // The CLI outputs a diffrent amount of inputs with diffrent values
    // everytime it runs. As we will be moving away from
    // the CLI we will just check that the CLI outpus something.
    expect(output.infos.length).toBeGreaterThan(0)
  })

  test('fails with error if CLI executable not found', async () => {
    const output = new CaptureOutput()
    try {
      await runRunbook({ parameters: standardInputParameters, env: {} }, output, 'not-octo')
      throw new Error('should not get here: expecting runRunbook to throw an exception')
    } catch (err: any) {
      expect(err.message).toMatch(
        // regex because the error prints the underlying nodejs error which has different text on different platforms, and we're not worried about
        // asserting on that
        new RegExp(
          "Octopus CLI executable missing. Ensure you have added the 'OctopusDeploy/install-octopus-cli-action@v1' step to your GitHub actions workflow"
        )
      )
    }

    expect(output.getAllMessages()).toEqual([])
  })

  test('fails picks up stderr from executable as well as return codes', async () => {
    const output = new CaptureOutput()

    let tmpDirPath = pathJoin(tmpdir(), runId)
    mkdirSync(tmpDirPath)

    let exePath: string
    if (isWindows) {
      const fileContents =
        '@echo off\n' + 'echo An informational Message\n' + 'echo An error message 1>&2\n' + 'exit /b 37'
      exePath = pathJoin(tmpDirPath, 'erroring_executable.cmd')
      writeFileSync(exePath, fileContents)
    } else {
      const fileContents = 'echo An informational Message\n' + '>&2 echo "An error message "\n' + '(exit 37)'
      exePath = pathJoin(tmpDirPath, 'erroring_executable.sh')
      writeFileSync(exePath, fileContents)
      chmodSync(exePath, '755')
    }

    const expectedExitCode = 37
    try {
      await runRunbook({ parameters: standardInputParameters, env: {} }, output, exePath)
      throw new Error('should not get here: expecting runRunbook to throw an exception')
    } catch (err: any) {
      expect(err.message).toMatch(
        new RegExp(`The process .*erroring_executable.* failed with exit code ${expectedExitCode}`)
      )
    } finally {
      rmSync(tmpDirPath, { recursive: true })
    }

    expect(output.infos).toEqual(['An informational Message'])
    expect(output.warns).toEqual(['An error message ']) // trailing space is deliberate because of windows bat file
  })

  test('fails with error if CLI returns an error code', async () => {
    const output = new CaptureOutput()

    const expectedExitCode = isWindows ? 4294967295 : 255 // Process should return -1 which maps to 4294967295 on windows or 255 on linux
    const cliInputs = {
      parameters: makeInputParameters({
        // no project
        apiKey: apiClientConfig.apiKey,
        server: apiClientConfig.apiUri
      }),
      env: {}
    }

    try {
      await runRunbook(cliInputs, output, octoExecutable)
      throw new Error('should not get here: expecting runRunbook to throw an exception')
    } catch (err: any) {
      expect(err.message).toMatch(
        // regex because when run locally the output logs 'octo' but in GHA it logs '/opt/hostedtoolcache/octo/9.1.3/x64/octo'
        new RegExp(`The process .*octo.* failed with exit code ${expectedExitCode}`)
      )
    }

    expect(output.warns).toEqual([])
    console.log('Got: ', output.getAllMessages())
    expect(output.infos.length).toBeGreaterThan(0)
  })

  test('fails with error if CLI returns an error code (bad auth)', async () => {
    const output = new CaptureOutput()

    const expectedExitCode = isWindows ? 4294967291 : 2 // Process should return -3 which maps to 4294967291 on windows or 2 on linux

    const cliInputs = {
      parameters: makeInputParameters({
        project: localProjectName,
        apiKey: apiClientConfig.apiKey + 'ZZZ',
        server: apiClientConfig.apiUri
      }),
      env: {}
    }

    try {
      await runRunbook(cliInputs, output, octoExecutable)
      throw new Error('should not get here: expecting runRunbook to throw an exception')
    } catch (err: any) {
      expect(err.message).toMatch(
        // regex because when run locally the output logs 'octo' but in GHA it logs '/opt/hostedtoolcache/octo/9.1.3/x64/octo'
        new RegExp(`The process .*octo.* failed with exit code ${expectedExitCode}`)
      )
    }

    expect(output.warns).toEqual([])
    expectMatchAll(output.infos, [
      /Octopus CLI, version .*/,
      /Detected automation environment/,
      /The API key you provided was not valid. Please double-check your API key and try again. For instructions on finding your API key, please visit:/, // partial match because the URL might be oc.to or g.octopushq.com depending on how old the CLI is
      'Exit code: -5'
    ])
  })
})
