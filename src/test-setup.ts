import { setGracefulCleanup } from 'tmp'

setGracefulCleanup()

process.env = Object.assign(process.env, {
  GITHUB_ACTION: '1',
  INPUT_SERVER: process.env['OCTOPUS_URL'],
  INPUT_API_KEY: process.env['OCTOPUS_API_KEY'],
  INPUT_SPACE: 'Default',
  INPUT_PROJECT: 'Test Project',
  INPUT_RUNBOOK: 'Test Runbook',
  INPUT_ENVIRONMENTS: 'Dev \n Staging',
  INPUT_USE_GUIDED_FAILURE: false,
  INPUT_VARIABLES: ' foo: quux \n bar: xyzzy \n '
})
