# Changelog

## [3.3.1](https://github.com/OctopusDeploy/run-runbook-action/compare/v3.3.0...v3.3.1) (2025-03-12)


### Bug Fixes

* **deps:** update dependency @actions/core to v1.11.1 ([#415](https://github.com/OctopusDeploy/run-runbook-action/issues/415)) ([fab4b76](https://github.com/OctopusDeploy/run-runbook-action/commit/fab4b769c78e06838f6255e3ff0b81e05e6a5376))
* **deps:** update dependency @octopusdeploy/api-client to v3.5.2 ([#449](https://github.com/OctopusDeploy/run-runbook-action/issues/449)) ([fedfea0](https://github.com/OctopusDeploy/run-runbook-action/commit/fedfea0bc9ac5ec06b373dd0f0d924506425bf9c))

## [3.3.0](https://github.com/OctopusDeploy/run-runbook-action/compare/v3.2.1...v3.3.0) (2024-12-18)


### Features

* Added Git Runbook support ([#432](https://github.com/OctopusDeploy/run-runbook-action/issues/432)) ([5d47e3d](https://github.com/OctopusDeploy/run-runbook-action/commit/5d47e3d695793db309166fa556fa90b8f5d3c1da))

## [3.2.1](https://github.com/OctopusDeploy/run-runbook-action/compare/v3.2.0...v3.2.1) (2024-02-04)


### Bug Fixes

* **deps:** pin dependencies ([acebfc6](https://github.com/OctopusDeploy/run-runbook-action/commit/acebfc6660a9528f98fc7d6c99dd9abe98957db4))
* **deps:** update dependency @actions/core to v1.10.1 ([819a294](https://github.com/OctopusDeploy/run-runbook-action/commit/819a294b0de3608c047eb70eb805812b90c6d0be))

## [3.2.0](https://github.com/OctopusDeploy/run-runbook-action/compare/v3.1.0...v3.2.0) (2023-12-14)


### Features

* Upgrade to node 20 ([#313](https://github.com/OctopusDeploy/run-runbook-action/issues/313)) ([e865679](https://github.com/OctopusDeploy/run-runbook-action/commit/e8656790c7cd18f71542d44fe39f4603cebf49db))

## [3.1.0](https://github.com/OctopusDeploy/run-runbook-action/compare/v3.0.3...v3.1.0) (2023-08-30)


### Features

* Adds support for authenticating with access token ([#304](https://github.com/OctopusDeploy/run-runbook-action/issues/304)) ([bfe787c](https://github.com/OctopusDeploy/run-runbook-action/commit/bfe787c9edc46583003bee50964ecaf50ef9be93))

## [3.0.3](https://github.com/OctopusDeploy/run-runbook-action/compare/v3.0.2...v3.0.3) (2023-02-06)


### Bug Fixes

* Fixed a bug with the capability API checks ([#299](https://github.com/OctopusDeploy/run-runbook-action/issues/299)) ([3f4b34d](https://github.com/OctopusDeploy/run-runbook-action/commit/3f4b34df1a8e6c495a0b753729f5ec2baae6068a))

## [3.0.2](https://github.com/OctopusDeploy/run-runbook-action/compare/v3.0.1...v3.0.2) (2023-01-31)


### Bug Fixes

* Updated client library to get capability checks and better information on required Octopus version ([c95a407](https://github.com/OctopusDeploy/run-runbook-action/commit/c95a4072fe95fbd5c2ef93a03adfe4031c6cd062))

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
