import { getInputParameters } from './input-parameters'
import { debug, error, info, isDebug, setFailed, setOutput, warning } from '@actions/core'
import { Client, ClientConfiguration, Logger } from '@octopusdeploy/api-client'

// GitHub actions entrypoint
import { runRunbookFromInputs } from './api-wrapper'
import { writeFileSync } from 'fs'
;(async (): Promise<void> => {
  try {
    const logger: Logger = {
      debug: message => {
        if (isDebug()) {
          debug(message)
        }
      },
      info: message => info(message),
      warn: message => warning(message),
      error: (message, err) => {
        if (err !== undefined) {
          error(err.message)
        } else {
          error(message)
        }
      }
    }

    const parameters = getInputParameters()

    const config: ClientConfiguration = {
      userAgentApp: 'GitHubActions run-runbook-action',
      instanceURL: parameters.server,
      apiKey: parameters.apiKey,
      logging: logger
    }

    const client = await Client.create(config)

    const runResults = await runRunbookFromInputs(client, parameters)

    if (runResults.length > 0) {
      setOutput(
        'server_tasks',
        runResults.map(t => {
          return {
            serverTaskId: t.serverTaskId,
            environmentName: t.environmentName,
            tenantName: t.tenantName
          }
        })
      )
    }

    const stepSummaryFile = process.env.GITHUB_STEP_SUMMARY
    if (stepSummaryFile && runResults.length > 0) {
      writeFileSync(stepSummaryFile, `🐙 Octopus Deploy queued run(s) in Project **${parameters.project}**.`)
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      setFailed(e)
    }
  }
})()
