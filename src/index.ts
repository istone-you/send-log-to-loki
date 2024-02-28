import * as core from "@actions/core";
import * as github from "@actions/github";
import axios from "axios";

async function sendLog(): Promise<void> {
  const message = core.getInput("message");
  const lokiAddress = core.getInput("loki_address");
  const lokiUsername = core.getInput("loki_username");
  const lokiPassword = core.getInput("loki_password");
  const labelsInput = core.getInput("labels");
  let labels = {};

  try {
    if (labelsInput) {
      labels = JSON.parse(labelsInput);
    }
  } catch (error) {
    console.error("Error parsing labels:", error);
    core.setFailed("Error parsing labels");
    return;
  }

  const repositoryOwner = github.context.repo.owner;
  const repositoryName = github.context.repo.repo;
  const action = github.context.action;
  const workflow = github.context.workflow;

  const logEntry = {
    streams: [
      {
        stream: {
          source: "lokisend-cli",
          repositoryOwner,
          repositoryName,
          action,
          workflow,
          ...labels,
        },
        values: [[`${Date.now()}000000`, message]],
      },
    ],
  };

  try {
    const response = await axios.post(
      `${lokiAddress}/loki/api/v1/push`,
      logEntry,
      {
        headers: { "Content-Type": "application/json" },
        auth: { username: lokiUsername, password: lokiPassword },
      }
    );
    console.log("Log sent successfully", response.data);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error sending log to Loki:", error.message);
      core.setFailed(error.message);
    } else {
      console.error("An unknown error occurred");
      core.setFailed("An unknown error occurred");
    }
  }
}

sendLog();
