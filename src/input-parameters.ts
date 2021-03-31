import * as core from '@actions/core'
import {getBooleanInput} from './get-boolean-input'

export interface InputParameters {
  apiKey: string
  cancelOnTimeout: boolean
  configFile: string
  debug: boolean
  environments: string
  excludeMachines: string
  forcePackageDownload: boolean
  guidedFailure: string
  ignoreSslErrors: boolean
  logLevel: string
  noRawLog: boolean
  noRunAfter: string
  password: string
  project: string
  proxy: string
  proxyPassword: string
  proxyUsername: string
  rawLogFile: string
  runAt: string
  runbook: string
  runCheckSleepCycle: string
  runTimeout: string
  server: string
  showProgress: boolean
  skip: string
  snapshot: string
  space: string
  specificMachines: string
  tenant: string
  tenantTag: string
  timeout: string
  username: string
  variable: string
  waitForRun: boolean
}

export function get(): InputParameters {
  return {
    apiKey: core.getInput('api_key'),
    cancelOnTimeout: getBooleanInput('cancel_on_timeout'),
    configFile: core.getInput('config_file'),
    debug: getBooleanInput('debug'),
    environments: core.getInput('environments'),
    excludeMachines: core.getInput('exclude_machines'),
    forcePackageDownload: getBooleanInput('force_package_download'),
    guidedFailure: core.getInput('guided_failure'),
    ignoreSslErrors: getBooleanInput('ignore_ssl_errors'),
    logLevel: core.getInput('log_level'),
    noRawLog: getBooleanInput('no_raw_log'),
    noRunAfter: core.getInput('no_run_after'),
    password: core.getInput('password'),
    project: core.getInput('project'),
    proxy: core.getInput('proxy'),
    proxyPassword: core.getInput('proxy_password'),
    proxyUsername: core.getInput('proxy_username'),
    rawLogFile: core.getInput('raw_log_file'),
    runAt: core.getInput('run_at'),
    runbook: core.getInput('runbook'),
    runCheckSleepCycle: core.getInput('run_check_sleep_cycle'),
    runTimeout: core.getInput('run_timeout'),
    server: core.getInput('server'),
    showProgress: getBooleanInput('show_progress'),
    skip: core.getInput('skip'),
    snapshot: core.getInput('snapshot'),
    space: core.getInput('space'),
    specificMachines: core.getInput('specific_machines'),
    tenant: core.getInput('tenant'),
    tenantTag: core.getInput('tenant_tag'),
    timeout: core.getInput('timeout'),
    username: core.getInput('username'),
    variable: core.getInput('variable'),
    waitForRun: getBooleanInput('wait_for_run')
  }
}
