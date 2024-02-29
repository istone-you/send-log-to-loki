# "Send Log to Loki" Action for GitHub Actions

This GitHub Action sends logs from GitHub Actions workflows to [Grafana Loki](https://grafana.com/oss/loki/), a horizontally-scalable, highly-available, multi-tenant log aggregation system. Utilize this action to streamline the monitoring and debugging of your development processes.

## Features

The features of this action include:

It can send execution information of GitHub Actions (such as execution time and URL) to Loki.
It allows including custom messages and labels in the logs.

## Prerequisites

- A Grafana Loki instance set up and accessible.
- Credentials (username and password) for sending logs to Loki.

## Usage

Simply include the following action in your workflow.

```yaml
- name: Send log to Loki
  uses: istone-you/send-log-to-loki@v1
  with:
    message: "Freely describe the log message"
    measurement: "start"
    loki_address: "http://your-loki-instance:3100"
    loki_username: ${{ secrets.LOKI_USERNAME }}
    loki_password: ${{ secrets.LOKI_PASSWORD }}
    labels: '{"key": "value"}'
```

**Parameters**:

- `message`: The log message you want to send to Loki.
- `measurement`: Specify "start" to record the start time or "finish" to calculate and send the execution duration.(Optional)
- `loki_address`: The URL to your Loki instance.
- `loki_username`: The username for accessing Loki.
- `loki_password`: The password for accessing Loki.
- `labels`: A JSON string of key-value pairs to be attached as labels to the log message.(Optional)

## Labels Included in the Log

The log sent to Loki will include the following labels:

- `actor`: The executor
- `branch`: Branch name
- `duration`: Execution time (recorded when "start" and "finish" are specified for the measurement parameter)
- `job`: Job name
- `measurement`: The value of the measurement parameter specified at the time of action execution
- `repositoryName`: Repository name
- `repositoryOwner`: Repository owner
- `runId`: Execution ID
- `runNumber`: Execution number
- `source`: Contains the value github-actions
- `url`: URL
- `workflow`: Workflow name

Other labels will include those specified in the labels parameter.

## Contributing

Contributions to the send-log-to-loki action are welcome! Please submit pull requests or open issues to suggest improvements or add new features.

## License

Specify your license here, e.g., "Distributed under the MIT License. See LICENSE for more information."
