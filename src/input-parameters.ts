import {getBooleanInput, getInput, getMultilineInput} from '@actions/core'

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
  tenants: string[]
  tenantTag: string
  tenantTags: string[]
  timeout: string
  username: string
  variable: string
  variables: string[]
  waitForRun: boolean
}

export function get(): InputParameters {
  return {
    apiKey: getInput('api_key'),
    cancelOnTimeout: getBooleanInput('cancel_on_timeout'),
    configFile: getInput('config_file'),
    debug: getBooleanInput('debug'),
    environments: getInput('environments'),
    excludeMachines: getInput('exclude_machines'),
    forcePackageDownload: getBooleanInput('force_package_download'),
    guidedFailure: getInput('guided_failure'),
    ignoreSslErrors: getBooleanInput('ignore_ssl_errors'),
    logLevel: getInput('log_level'),
    noRawLog: getBooleanInput('no_raw_log'),
    noRunAfter: getInput('no_run_after'),
    password: getInput('password'),
    project: getInput('project'),
    proxy: getInput('proxy'),
    proxyPassword: getInput('proxy_password'),
    proxyUsername: getInput('proxy_username'),
    rawLogFile: getInput('raw_log_file'),
    runAt: getInput('run_at'),
    runbook: getInput('runbook'),
    runCheckSleepCycle: getInput('run_check_sleep_cycle'),
    runTimeout: getInput('run_timeout'),
    server: getInput('server'),
    showProgress: getBooleanInput('show_progress'),
    skip: getInput('skip'),
    snapshot: getInput('snapshot'),
    space: getInput('space'),
    specificMachines: getInput('specific_machines'),
    tenant: getInput('tenant'),
    tenants: getMultilineInput('tenants'),
    tenantTag: getInput('tenant_tag'),
    tenantTags: getMultilineInput('tenant_tags'),
    timeout: getInput('timeout'),
    username: getInput('username'),
    variable: getInput('variable'),
    variables: getMultilineInput('variables'),
    waitForRun: getBooleanInput('wait_for_run')
  }
}
