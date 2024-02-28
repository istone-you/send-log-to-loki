const core = require("@actions/core");
const axios = require("axios");

async function sendLog() {
  const message = core.getInput("message");
  const lokiAddress = core.getInput("loki_address");
  const lokiUsername = core.getInput("loki_username");
  const lokiPassword = core.getInput("loki_password");

  const logEntry = {
    streams: [
      {
        stream: { source: "lokisend-cli" },
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
    console.error("Error sending log to Loki:", error);
    core.setFailed(error.message);
  }
}

sendLog();
