import config from './config';
import routes from './routes';

import createSonarQube from './services/sonarQubeService';
import createPrometheus from './services/prometheusService';

import simpleExpress from 'services/simpleExpress/simpleExpress';

(async function() {
  const sonarQube = await createSonarQube({ sonarQubeUrl: config.sonarQubeUrl, apiKey: config.sonarQubeKey });
  const prometheus = await createPrometheus();

  simpleExpress({
    port: config.port,
    routes,
    routeParams: { sonarQube, prometheus },
  })
    .then(({ app }) => console.log(`Started on port ${app.server.address().port}`))
    .catch(error => console.error('Error', error));
})();
