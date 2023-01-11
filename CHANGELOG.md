# Changelog

## [3.0.1](https://github.com/OctopusDeploy/run-runbook-action/compare/v3.0.0...v3.0.1) (2023-01-11)


### Bug Fixes

* Fixed issue with serialization of prompted variable values ([#294](https://github.com/OctopusDeploy/run-runbook-action/issues/294)) ([8a35c76](https://github.com/OctopusDeploy/run-runbook-action/commit/8a35c76594ad28a6e0a50f508237e44c6441bc26))

## [3.0.0](https://github.com/OctopusDeploy/run-runbook-action/compare/v2.1.0...v3.0.0) (2022-12-13)


### ⚠ BREAKING CHANGES

* Updated action to use the native API client

### Features

* Updated action to use the native API client ([959a89a](https://github.com/OctopusDeploy/run-runbook-action/commit/959a89aae391c0bbc8b118154bd7af203d51dbee))


### Bug Fixes

* updated dependencies ([ab97aa6](https://github.com/OctopusDeploy/run-runbook-action/commit/ab97aa6bde4b51dfcb725f5915f41f363b2bb30d))

## [2.1.0](https://github.com/OctopusDeploy/run-runbook-action/compare/v2.0.1...v2.1.0) (2022-11-04)


### Features

* bump dependencies ([4709116](https://github.com/OctopusDeploy/run-runbook-action/commit/470911616347dc299be6363b57f658c1323b04c9))
* Bump to Node16 ([a722bbd](https://github.com/OctopusDeploy/run-runbook-action/commit/a722bbdf3736900191982e8f63954993ca518bd1))

## [2.0.1](https://github.com/OctopusDeploy/run-runbook-action/compare/v2.0.0...v2.0.1) (2022-07-18)


### Bug Fixes

* Environment variables from the GitHub action context were not passed through to the underlying Octopus CLI ([095ce5d](https://github.com/OctopusDeploy/run-runbook-action/commit/095ce5d0bbce0cdb2ad33eb047a44f7779427073))
* StdError and the process exit code returned by the CLI are now shown in Github Action runs ([095ce5d](https://github.com/OctopusDeploy/run-runbook-action/commit/095ce5d0bbce0cdb2ad33eb047a44f7779427073))

## [2.0.0](https://github.com/OctopusDeploy/run-runbook-action/compare/v1.1.0...v2.0.0) (2022-07-14)


### ⚠ BREAKING CHANGES

* v2 (#250)

### Features

* implemented support for multiple input values ([20d2ac7](https://github.com/OctopusDeploy/run-runbook-action/commit/20d2ac72af431bc293141d6b6bc8e7f27dc7d85d))
* remove unused tags ([1e0f2ca](https://github.com/OctopusDeploy/run-runbook-action/commit/1e0f2caf65b6a0c647c0a354f2a1a54149ca71ec))
* v2 ([#250](https://github.com/OctopusDeploy/run-runbook-action/issues/250)) ([1e0f2ca](https://github.com/OctopusDeploy/run-runbook-action/commit/1e0f2caf65b6a0c647c0a354f2a1a54149ca71ec))


### Bug Fixes

* added missing input test values ([d6aecfd](https://github.com/OctopusDeploy/run-runbook-action/commit/d6aecfd7d7faa79cd4b7148d9c1d1d0428611ba1))

## [1.1.0](https://github.com/OctopusDeploy/run-runbook-action/compare/v1.0.1...v1.1.0) (2022-05-26)


### Features

* implemented support for multiple input values ([20d2ac7](https://github.com/OctopusDeploy/run-runbook-action/commit/20d2ac72af431bc293141d6b6bc8e7f27dc7d85d))

### [1.0.1](https://www.github.com/OctopusDeploy/run-runbook-action/compare/v1.0.0...v1.0.1) (2021-09-18)


### Bug Fixes

* added missing input test values ([d6aecfd](https://www.github.com/OctopusDeploy/run-runbook-action/commit/d6aecfd7d7faa79cd4b7148d9c1d1d0428611ba1))
