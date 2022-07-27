# Migration Guide

## v1 to v2

The number of input parameters have been greatly reduced in v2 of this action. This change was made to reflect the majority of use cases observed across GitHub repositories.

Please note that the the following input parameters have been removed in v2 of this action:

- `cancel_on_timeout`
- `config_file`
- `debug`
- `exclude_machines`
- `force_package_download`
- `guided_failure`
- `ignore_ssl_errors`
- `log_level`
- `no_raw_log`
- `no_run_after`
- `password`
- `raw_log_file`
- `run_at`
- `run_timeout`
- `show_progress`
- `skip`
- `specific_machines`
- `tenant`
- `tenants`
- `tenant_tag`
- `tenant_tags`
- `timeout`
- `username`
- `variable`
- `wait_for_run`

This action strongly encourages the using a combination of secrets and environment variables for sensitive values such as the Octopus host or the API key. For that reason, we have modified the action to encourage users environment variables.
