import fs from "fs";
import path from "path";

// Ensure the logs directory exists
const logDir = path.join("src", "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Log file path
const logFile = path.join(logDir, "ai_logs.txt");

/**
 * Logs AI prompt and response with timestamp
 * @param {string} prompt - The AI prompt sent
 * @param {string} response - The AI-generated response
 */
export const logPrompt = (prompt, response) => {
  const logEntry = `
==============================
Timestamp: ${new Date().toISOString()}

PROMPT:
${prompt}

RESPONSE:
${response}

==============================
`;

  // Console output for quick debugging
  console.log(logEntry);

  // Append to file for audit trail
  try {
    fs.appendFileSync(logFile, logEntry);
  } catch (err) {
    console.error("Failed to write AI log:", err.message);
  }
};
