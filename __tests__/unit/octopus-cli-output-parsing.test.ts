import {makeInputParameters} from '../../src/input-parameters'
import {OctopusCliWrapper} from '../../src/octopus-cli-wrapper'

let infoMessages: string[]
let warnMessages: string[]
let w: OctopusCliWrapper

beforeEach(() => {
  infoMessages = []
  warnMessages = []
  w = new OctopusCliWrapper(
    makeInputParameters(),
    {},
    msg => infoMessages.push(msg),
    msg => warnMessages.push(msg)
  )
})

afterEach(() => {
  expect(warnMessages).toEqual([]) // none of our tests here should generate warnings
})

test('standard commandline processing', () => {
  w.stdline('Octopus Deploy Command Line Tool version 123')
  w.stdline('Handshaking with Octopus Server')
  w.stdline('Authenticated as: magic user that should not be revealed')
  w.stdline('Done!')

  expect(infoMessages).toEqual([
    '🐙 Using Octopus Deploy CLI 123...',
    '🤝 Handshaking with Octopus Deploy',
    '✅ Authenticated',
    '🎉 Runbook complete!'
  ])
})

test('filters blank lines', () => {
  w.stdline('')
  w.stdline('foo')
  w.stdline('')

  expect(infoMessages).toEqual(['foo'])
})
