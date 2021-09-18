import * as tmp from 'tmp'

tmp.setGracefulCleanup()
const tmpdir = tmp.dirSync({template: 'run-runbook-XXXXXX'})
process.env = Object.assign(process.env, {
  GITHUB_ACTION: '1',
  INPUT_API_KEY: process.env['OCTOPUS_APIKEY'],
  INPUT_CANCEL_ON_TIMEOUT: false,
  INPUT_DEBUG: false,
  INPUT_ENVIRONMENTS: 'Webinar Environment',
  INPUT_FORCE_PACKAGE_DOWNLOAD: false,
  INPUT_IGNORE_SSL_ERRORS: false,
  INPUT_NO_RAW_LOG: false,
  INPUT_PROJECT: 'Projects-6445',
  INPUT_RUNBOOK: 'Runbooks-701',
  INPUT_SERVER: process.env['OCTOPUS_URL'],
  INPUT_SHOW_PROGRESS: 'true',
  INPUT_WAIT_FOR_RUN: false,
  RUNNER_TEMP: tmpdir.name,
  RUNNER_TOOL_CACHE: tmpdir.name
})
