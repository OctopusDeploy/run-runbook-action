# run-runbook-action

<img alt= "" src="https://github.com/OctopusDeploy/run-runbook-action/raw/main/assets/github-actions-octopus.png" />

This is a GitHub Action will run a runbook in Octopus Deploy. It requires the [Octopus CLI](https://octopus.com/docs/octopus-rest-api/octopus-cli); please ensure to include [install-octopus-cli-action](https://github.com/OctopusDeploy/install-octopus-cli-action) in your workflow (example below) before using this GitHub Action.

## Migration Guide(s)

Please refer to the [migration guide](migration-guide.md) if moving between major versions of this action.

## Examples

Incorporate the following actions in your workflow to push a package to Octopus Deploy using an API key, a target instance (i.e. `server`), and a project:

```yml
steps:
  - uses: actions/checkout@v2
  - name: Install Octopus CLI 🐙
    uses: OctopusDeploy/install-octopus-cli-action@<version>
    with:
      version: latest
  - name: Run a runbook in Octopus Deploy 🐙
    uses: OctopusDeploy/run-runbook-action@<version>
    with:
      environments: 'Test Environment'
      project: 'Test Project'
      runbook: 'Test Runbook'
    env:
      OCTOPUS_API_KEY: ${{ secrets.API_KEY  }}
      OCTOPUS_HOST: ${{ secrets.SERVER }}
      OCTOPUS_SPACE: 'Spaces-1'
```

## ✍️ Environment Variables

| Name                     | Description                                                                                                                                                                                                                                      |
| :----------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OCTOPUS_API_KEY`        | The API key used to access Octopus Deploy. `API-GUEST` may be used if the guest account is enabled. It is strongly recommended that this value retrieved from a GitHub secret.                                                                   |
| `OCTOPUS_HOST`           | The base URL hosting Octopus Deploy (i.e. `https://octopus.example.com`). It is strongly recommended that this value retrieved from a GitHub secret.                                                                                             |
| `OCTOPUS_PROXY`          | The URL of a proxy to use (i.e. `https://proxy.example.com`). If `OCTOPUS_PROXY_USERNAME` and `OCTOPUS_PROXY_PASSWORD` are omitted, the default credentials are used. It is strongly recommended that this value retrieved from a GitHub secret. |
| `OCTOPUS_PROXY_PASSWORD` | The password used to connect to a proxy. It is strongly recommended to retrieve this value from a GitHub secret.                                                                                                                                 |
| `OCTOPUS_PROXY_USERNAME` | The username used to connect to a proxy. It is strongly recommended to retrieve this value from a GitHub secret.                                                                                                                                 |
| `OCTOPUS_SPACE`          | The ID of a space within which this command will be executed.                                                                                                                                                                                    |

## 📥 Inputs

The following input is required:

| Name      | Description                                                                                               |
| :-------- | :-------------------------------------------------------------------------------------------------------- |
| `project` | The name or ID of the project associated with this runbook.                                               |
| `runbook` | The name or ID of the runbook. If the name is supplied, the `project` input value must also be specified. |
| `environments`           | A comma-delimited list of environments in Octopus Deploy in which to run (i.e. "Dev,Test,Prod").                                                                                                                                                                  |  

The following inputs are optional:

| Name                     | Description                                                                                                                                                                                                                                                       |  Default   |
| :----------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------: |
| `variable`               | Values for any prompted variables (format: `Label:Value`). For JSON values, embedded quotation marks should be escaped with a backslash.                                                                                                                          |            |
| `api_key`                | The API key used to access Octopus Deploy. An API key is required, but you may also use the OCTOPUS_API_KEY environment variable. `API-GUEST` may be used if the guest account is enabled. It is strongly recommended that this value retrieved from a GitHub secret. |            |
| `proxy`                  | The URL of a proxy to use (i.e. `https://proxy.example.com`).                                                                                                                                                                                                     |            |
| `proxy_password`         | The password used to connect to a proxy. It is strongly recommended to retrieve this value from a GitHub secret. If `proxy_username` and `proxy_password` are omitted and `proxy` is specified, the default credentials are used.                                 |            |
| `proxy_username`         | The username used to connect to a proxy. It is strongly recommended to retrieve this value from a GitHub secret.                                                                                                                                                  |            |
| `server`                 | The base URL hosting Octopus Deploy (i.e. `https://octopus.example.com`). The Server URL is required, but you may also use the OCTOPUS_HOST environment variable. variable.                                                                                                                  |            |
| `space`                  | The name or ID of a space within which this command will be executed. If omitted, the default space will be used.                                                                                                                                                 |            |

## 🤝 Contributions

Contributions are welcome! :heart: Please read our [Contributing Guide](CONTRIBUTING.md) for information about how to get involved in this project.
