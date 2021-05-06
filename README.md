# run-runbook-action

<img alt= "" src="https://github.com/OctopusDeploy/run-runbook-action/raw/main/assets/github-actions-octopus.png" />

This is a GitHub Action will run a runbook in Octopus Deploy. It requires the [Octopus CLI](https://octopus.com/docs/octopus-rest-api/octopus-cli); please ensure to include [install-octopus-cli-action](https://github.com/OctopusDeploy/install-octopus-cli-action) in your workflow (example below) before using this GitHub Action.

## Examples

Incorporate the following actions in your workflow to push a package to Octopus Deploy using an API key, a target instance (i.e. `server`), and a project:

```yml
steps:
  - uses: actions/checkout@v2
  - name: Install Octopus CLI 🐙
    uses: OctopusDeploy/install-octopus-cli-action@v1.1.6
    with:
      version: latest
  - name: Run a runbook in Octopus Deploy 🐙
    uses: OctopusDeploy/run-runbook-action@v1.0.0
    with:
      api_key: ${{ secrets.API_KEY }}
      environments: "Test Environment"
      project: "Test Project"
      runbook: "Test Runbook"
      server: ${{ secrets.SERVER }}
      show_progress: "true"
```

Here's an example that provides a `username` and `password` to authenticate to Octopus Deploy:

```yml
steps:
  - uses: actions/checkout@v2
  - name: Install Octopus CLI 🐙
    uses: OctopusDeploy/install-octopus-cli-action@v1.1.6
    with:
      version: latest
  - name: Run a runbook in Octopus Deploy 🐙
    uses: OctopusDeploy/run-runbook-action@v1.0.0
    with:
      environments: "Test Environment"
      password: ${{ secrets.PASSWORD }}
      project: "Test Project"
      runbook: "Test Runbook"
      server: ${{ secrets.SERVER }}
      show_progress: "true"
      username: ${{ secrets.USERNAME }}
```

## Action Inputs

The following input is required:

| Name | Description |
| :- | :- |
| `project` | The name or ID of the project associated with this runbook. |

The following inputs are optional:

| Name | Description | Default |
| :- | :- | :-: |
| `api_key` | The API key used to access Octopus Deploy. This value is required if credentials (`username` and `password`) are unspecified. `API-GUEST` may be used if the guest account is enabled. It is strongly recommended that this value retrieved from a GitHub secret. | |
| `cancel_on_timeout` | Cancel the deployment if `deployment_timeout` is exceeded (default: 10 minutes). | `false` |
| `config_file` | The path to a configuration file of default values with one `key=value` per line. | |
| `debug` | Enable debug logging. | `false` |
| `environments` | A comma-delimited list of environments in Octopus Deploy in which to run (i.e. "Dev,Test,Prod"). | |
| `exclude_machines` | A comma-separated list of machine names to exclude in the deployed environment. If empty, all machines in the environment will be considered. | |
| `force_package_download` | Force download of installed packages. | `false` |
| `guided_failure` | Use [Guided Failure mode](https://octopus.com/docs/releases/guided-failures). | `false` |
| `ignore_ssl_errors` | Ignore certificate errors when communicating with Octopus Deploy. Warning: enabling this option creates a security vulnerability. | `false` |
| `log_level` | The log level; valid options are `verbose`, `debug`, `information`, `warning`, `error`, and `fatal`. | `debug` |
| `no_raw_log` | Print the raw log of failed tasks. | `false` |
| `no_run_after` | The time at which scheduled runbook run should expire, specified as any valid DateTimeOffset format, and assuming the time zone is the current local time zone. | |
| `password` | The password to used to authenticate with Octopus Deploy. It is strongly recommended to retrieve this value from a GitHub secret. | |
| `proxy` | The URL of a proxy to use (i.e. `https://proxy.example.com`). | |
| `proxy_password` | The password used to connect to a proxy. It is strongly recommended to retrieve this value from a GitHub secret. If `proxy_username` and `proxy_password` are omitted and `proxy` is specified, the default credentials are used. | |
| `proxy_username` | The username used to connect to a proxy. It is strongly recommended to retrieve this value from a GitHub secret. | |
| `raw_log_file` | Redirect the raw log of failed tasks to a file. | |
| `run_at` | The time at which runbook run should start (scheduled run), specified as any valid DateTimeOffset format, and assuming the time zone is the current local time zone. | |
| `runbook` | The name or ID of the runbook. If the name is supplied, the `project` input value must also be specified. | |
| `run_check_sleep_cycle` | The length of time that should elapse between runbook run status checks (format: HH:MM:SS). | `00:00:10` |
| `run_timeout` | The maximum length of time that the console session will wait for the runbook run to finish. Note: This will not stop the run. This input requires the `wait_for_run` input value to be `true` (format: HH:MM:SS). | `00:10:00` |
| `server` | The base URL hosting Octopus Deploy (i.e. `https://octopus.example.com`). It is recommended to retrieve this value from an environment variable. | |
| `show_progress` | Show progress of the runbook. | `false` |
| `skip` | Skip a step by name. | |
| `snapshot` | The name or ID of the snapshot to run. If not supplied, this action will attempt to use the published snapshot. | |
| `space` | The name or ID of a space within which this command will be executed. If omitted, the default space will be used. | |
| `specific_machines` | A comma-separated list of machine names to target in the deployed environment. If not specified all machines in the environment will be considered. | |
| `tenant` | Create a deployment for the tenant with this name or ID; specify this argument multiple times to add multiple tenants or use a wildcard (`*`) to deploy to all tenants who are ready for this release (according to lifecycle). | |
| `tenant_tag` | Create a deployment for tenants matching this tag; specify this argument multiple times to build a query/filter with multiple tags. | |
| `timeout` | A timeout value for network operations (in seconds). | `600` |
| `username` | The username used to authenticate with Octopus Deploy. You must provide `api_key` or `username` and `password`. It is strongly recommended to retrieve this value from a GitHub secret. | |
| `variable` | Values for any prompted variables (format: `Label:Value`). For JSON values, embedded quotation marks should be escaped with a backslash. | |
| `wait_for_run` | Indicates whether or not to wait synchronously for deployment to finish. | `false` |