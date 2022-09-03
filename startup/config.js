const environmentVariablesList = [
  "DB_CONN_STRING",
  "JWT_PRIVATE_KEY",
  "HOST",
  "EMAIL",
  "FRONTEND_BASE_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "SESSION_SECRET",
];

module.exports = () => {
  for (let variable of environmentVariablesList) {
    if (!process.env[variable]) {
      throw new Error(`FATAL ERROR: ${variable} is not defined`);
    }
  }
};
