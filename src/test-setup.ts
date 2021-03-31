import * as tmp from 'tmp'

tmp.setGracefulCleanup()
const tmpdir = tmp.dirSync({template: 'run-runbook-XXXXXX'})
process.env = Object.assign(process.env, {
  INPUT_API_KEY: process.env['OCTOPUS_APIKEY'],
  INPUT_SERVER: process.env['OCTOPUS_URL'],
  INPUT_ENVIRONMENTS: 'Webinar Environment',
  INPUT_PROJECT: 'Projects-6445',
  INPUT_RUNBOOK: 'Runbooks-701',
  INPUT_SHOW_PROGRESS: 'true',
  RUNNER_TEMP: tmpdir.name,
  RUNNER_TOOL_CACHE: tmpdir.name,
  GITHUB_ACTION: '1'
})
