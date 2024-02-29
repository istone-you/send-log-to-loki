# "Send Log to Loki" Action for GitHub Actions

This GitHub Action sends logs from GitHub Actions workflows to [Grafana Loki](https://grafana.com/oss/loki/), a horizontally-scalable, highly-available, multi-tenant log aggregation system. Utilize this action to streamline the monitoring and debugging of your development processes.

## Features

- Sends execution information of GitHub Actions (e.g., start and end times) to Loki.
- Allows including custom messages and labels with logs.
- Includes the GitHub Actions execution URL in the log labels for easy access.

## Prerequisites

- A Grafana Loki instance set up and accessible.
- Credentials (username and password) for sending logs to Loki.

## Usage

### Step 1: Setup the Action

Include the action in your workflow by adding the following step:

```yaml
- name: Send log to Loki
  uses: istone-you/send-log-to-loki@v1
  with:
    message: "Your log message"
    measurement: "start"
    loki_address: "http://your-loki-instance:3100"
    loki_username: ${{ secrets.LOKI_USERNAME }}
    loki_password: ${{ secrets.LOKI_PASSWORD }}
    labels: '{"key": "value"}' 
```

**Parameters**:

- `message`: The log message you want to send to Loki.
- `measurement`: (Optional) Specify "start" to record the start time or "finish" to calculate and send the execution duration.
- `loki_address`: The URL to your Loki instance.
- `loki_username` and `loki_password`: Credentials for Loki authentication.
- `labels`: (Optional) A JSON string of key-value pairs to be attached as labels to the log message.

### Step 2: Add Loki Credentials to Your GitHub Secrets

For security reasons, it's recommended to store your Loki credentials (LOKI_USERNAME and LOKI_PASSWORD) in the GitHub repository secrets.

### Step 3: Configure Loki to Receive Logs

Ensure your Loki instance is configured to receive logs over HTTP. Consult the [Loki documentation](https://grafana.com/docs/loki/latest/setup/) for guidance on setting up your Loki server.

## Contributing

Contributions to the send-log-to-loki action are welcome! Please submit pull requests or open issues to suggest improvements or add new features.

## License

Specify your license here, e.g., "Distributed under the MIT License. See LICENSE for more information."
