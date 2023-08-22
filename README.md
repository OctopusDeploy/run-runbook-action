# run-runbook-action

<img alt= "" src="https://github.com/OctopusDeploy/run-runbook-action/raw/main/assets/github-actions-octopus.png" />

This is a GitHub Action that will run a [runbook](https://octopus.com/docs/runbooks) in Octopus Deploy.

## Migration Guide(s)

Please refer to the [migration guide](migration-guide.md) if moving between major versions of this action.

## Examples

Incorporate the following actions in your workflow to push a package to Octopus Deploy using an API key, a target instance (i.e. `server`), and a project:

```yml
steps:
  - name: Run a runbook in Octopus Deploy 🐙
    uses: OctopusDeploy/run-runbook-action@v3
    env:
      OCTOPUS_API_KEY: ${{ secrets.API_KEY  }}
      OCTOPUS_URL: ${{ secrets.SERVER }}
      OCTOPUS_SPACE: 'Outer Space'
    with:
      project: 'Test Project'
      runbook: 'Test Runbook'
      environments: |
        'Dev'
        'Test'
```

## ✍️ Environment Variables

| Name                   | Description                                                                                                                                                                                                                                                       |
| :--------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OCTOPUS_URL`          | The base URL hosting Octopus Deploy (i.e. `https://octopus.example.com`). It is strongly recommended that this value retrieved from a GitHub secret.                                                                                                              |
| `OCTOPUS_API_KEY`      | The API key used to access Octopus Deploy. It is strongly recommended that this value retrieved from a GitHub secret.                                                                                                                                             |
| `OCTOPUS_ACCESS_TOKEN` | The access token used to access Octopus Deploy. An access token can be obtained via OpenID Connect by using the `OctopusDeploy/login` action. Please note that this feature is currently under development and may not be available on your Octopus instance yet. |
| `OCTOPUS_SPACE`        | The Name of a space within which this command will be executed.                                                                                                                                                                                                   |

## 📥 Inputs

| Name           | Description                                                                                                                                                                                                                                                                                                                                                   |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `project`      | **Required.** The name of the project associated with this runbook.                                                                                                                                                                                                                                                                                           |
| `runbook`      | **Required.** The name of the runbook.                                                                                                                                                                                                                                                                                                                        |
| `environments` | **Required.** A list of environments in Octopus Deploy in which to run (i.e. Dev, Test, Prod). Each environment should be added on a new line.                                                                                                                                                                                                                |
| `variables`    | A multi-line list of prompted variable values. Format: name:value.                                                                                                                                                                                                                                                                                            |
| `server`       | The instance URL hosting Octopus Deploy (i.e. "<https://octopus.example.com/>"). The instance URL is required, but you may also use the OCTOPUS_URL environment variable.                                                                                                                                                                                     |
| `api_key`      | The API key used to access Octopus Deploy. An API key is required, but you may also use the OCTOPUS_API_KEY environment variable. It is strongly recommended that this value retrieved from a GitHub secret.                                                                                                                                                  |
| `access_token` | The access token used to access Octopus Deploy. An API key is required, but you may also use the OCTOPUS_ACCESS_TOKEN environment variable. An access token can be obtained via OpenID Connect by using the `OctopusDeploy/login` action. Please note that this feature is currently under development and may not be available on your Octopus instance yet. |
| `space`        | The name of a space within which this command will be executed. The space name is required, but you may also use the OCTOPUS_SPACE environment variable.                                                                                                                                                                                                      |

## 📤 Outputs

| Name           | Description                                                                                                                                                                                                                                                                                           |
| :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `server_tasks` | JSON array of objects containing the Octopus Deploy server tasks Ids (`serverTaskId`) and environment name (`environmentName`), and tenant name (`tenantName`) if the run was for a tenant, for the executions tasks that were queued. Use the `await-task-action`to wait for any/all of these tasks. |

## 🤝 Contributions

Contributions are welcome! :heart: Please read our [Contributing Guide](CONTRIBUTING.md) for information about how to get involved in this project.
