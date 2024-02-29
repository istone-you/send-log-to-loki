import * as core from "@actions/core";
import * as github from "@actions/github";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";

async function sendLog(): Promise<void> {
  const message = core.getInput("message");
  const measurement = core.getInput("measurement");
  const lokiAddress = core.getInput("loki_address");
  const lokiUsername = core.getInput("loki_username");
  const lokiPassword = core.getInput("loki_password");
  const labelsInput = core.getInput("labels") || "{}";
  const timeFilePath = path.join(
    process.env.GITHUB_WORKSPACE || "",
    "action_time.txt"
  );

  let labels: { [key: string]: string };

  try {
    labels = JSON.parse(labelsInput);
  } catch (error) {
    console.error("Error parsing labels:", error);
    core.setFailed("Error parsing labels");

    return;
  }

  if (measurement) {
    labels["measurement"] = measurement;
  }

  if (measurement === "start") {
    const startTime = Date.now().toString();

    fs.writeFileSync(timeFilePath, startTime);
  } else if (measurement === "finish" && fs.existsSync(timeFilePath)) {
    const startTime = parseInt(fs.readFileSync(timeFilePath, "utf8"), 10);
    const endTime = Date.now();
    const executionDuration = Math.round((endTime - startTime) / 1000);

    labels["duration"] = `${executionDuration}`;
  }

  const repositoryOwner = github.context.repo.owner;
  const repositoryName = github.context.repo.repo;
  const workflow = github.context.workflow;
  const runId = github.context.runId;
  const runNumber = github.context.runNumber;
  const actor = github.context.actor;
  const url = `https://github.com/${github.context.repo.owner}/${github.context.repo.repo}/actions/runs/${github.context.runId}`;

  const logEntry = {
    streams: [
      {
        stream: {
          source: "github-actions",
          repositoryOwner,
          repositoryName,
          workflow,
          runId,
          runNumber,
          actor,
          url,
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
