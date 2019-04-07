const config = {
  port: process.env.PORT || 8080,
  sonarQubeKey: process.env.SONAR_QUBE_KEY,
  sonarQubeUrl: process.env.SONAR_QUBE_URL,
  webhookToken: process.env.WEBHOOK_TOKEN,
  token: process.env.TOKEN,
};

export default config;
