import {InputParameters} from './input-parameters'
import * as core from '@actions/core'
import * as exec from '@actions/exec'

function getArgs(parameters: InputParameters): string[] {
  core.info('🔣 Parsing inputs...')

  const args = ['run-runbook']

  if (parameters.apiKey.length > 0) args.push(`--apiKey=${parameters.apiKey}`)
  if (parameters.cancelOnTimeout) args.push(`--cancelOnTimeout`)
  if (parameters.configFile.length > 0)
    args.push(`--configFile=${parameters.configFile}`)
  if (parameters.debug) args.push(`--debug`)

  if (parameters.environments.length > 0) {
    for (const iterator of parameters.environments.split(',')) {
      if (iterator.length > 0) {
        args.push(`--environment=${iterator}`)
      }
    }
  }

  if (parameters.excludeMachines.length > 0)
    args.push(`--excludeMachines=${parameters.excludeMachines}`)
  if (parameters.forcePackageDownload) args.push(`--forcePackageDownload`)
  if (parameters.guidedFailure) args.push(`--guidedFailure=True`)
  if (parameters.ignoreSslErrors) args.push(`--ignoreSslErrors`)
  if (parameters.logLevel.length > 0 && parameters.logLevel !== `debug`)
    args.push(`--logLevel=${parameters.logLevel}`)
  if (parameters.noRawLog) args.push(`--noRawLog`)
  if (parameters.noRunAfter.length > 0)
    args.push(`--noRunAfter=${parameters.noRunAfter}`)
  if (parameters.password.length > 0) args.push(`--pass=${parameters.password}`)
  if (parameters.project.length > 0)
    args.push(`--project=${parameters.project}`)
  if (parameters.proxy.length > 0) args.push(`--proxy=${parameters.proxy}`)
  if (parameters.proxyPassword.length > 0)
    args.push(`--proxyPass=${parameters.proxyPassword}`)
  if (parameters.proxyUsername.length > 0)
    args.push(`--proxyUser=${parameters.proxyUsername}`)
  if (parameters.rawLogFile.length > 0)
    args.push(`--rawLogFile=${parameters.rawLogFile}`)
  if (parameters.runAt.length > 0) args.push(`--runAt=${parameters.runAt}`)
  if (parameters.runbook.length > 0)
    args.push(`--runbook=${parameters.runbook}`)
  if (parameters.runCheckSleepCycle.length > 0)
    args.push(`--runCheckSleepCycle=${parameters.runCheckSleepCycle}`)
  if (parameters.runTimeout.length > 0)
    args.push(`--runTimeout=${parameters.runTimeout}`)
  if (parameters.server.length > 0) args.push(`--server=${parameters.server}`)
  if (parameters.showProgress) args.push(`--progress`)
  if (parameters.skip.length > 0) args.push(`--skip=${parameters.skip}`)
  if (parameters.snapshot.length > 0)
    args.push(`--snapshot=${parameters.snapshot}`)
  if (parameters.space.length > 0) args.push(`--space=${parameters.space}`)
  if (parameters.specificMachines.length > 0)
    args.push(`--specificMachines=${parameters.specificMachines}`)
  if (parameters.tenant.length > 0) args.push(`--tenant=${parameters.tenant}`)
  if (parameters.tenantTag.length > 0)
    args.push(`--tenantTag=${parameters.tenantTag}`)
  if (parameters.timeout.length > 0 && parameters.timeout !== `600`)
    args.push(`--timeout=${parameters.timeout}`)
  if (parameters.username.length > 0) args.push(`--user=${parameters.username}`)
  if (parameters.variable.length > 0)
    args.push(`--variable=${parameters.variable}`)
  if (parameters.waitForRun) args.push(`--waitForRun`)

  return args
}

export async function runRunbook(parameters: InputParameters): Promise<void> {
  const args = getArgs(parameters)

  const options: exec.ExecOptions = {
    ignoreReturnCode: true,
    listeners: {
      errline: (line: string) => {
        core.error(line)
      },
      stdline: (line: string) => {
        if (line.length <= 0) return

        if (line.includes('Octopus Deploy Command Line Tool')) {
          const version = line.split('version ')[1]
          core.info(`🐙 Using Octopus Deploy CLI ${version}...`)
          return
        }

        if (line.includes('Handshaking with Octopus Server')) {
          core.info(`🤝 Handshaking with Octopus Deploy`)
          return
        }

        if (line.includes('Authenticated as:')) {
          core.info(`✅ Authenticated`)
          return
        }

        if (line === 'Done!') {
          core.info(`🎉 Runbook complete!`)
          return
        }

        core.info(line)
      }
    },
    silent: true
  }

  await exec.exec('octo', args, options)
}
