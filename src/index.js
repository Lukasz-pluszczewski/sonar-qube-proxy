import checkPassword from 'middleware/authenticate';
import config from './config';
import routes from './routes';

import createSonarQube from './services/sonarQubeService';
import createInflux from './services/InfluxService';

import simpleExpress from 'services/simpleExpress/simpleExpress';

(async function() {
  const sonarQube = await createSonarQube({ sonarQubeUrl: config.sonarQubeUrl, apiKey: config.sonarQubeKey });
  const influx = await createInflux();

  simpleExpress({
    port: config.port,
    routes,
    globalMiddlewares: [
      checkPassword(config.password),
    ],
    routeParams: { sonarQube, influx },
  })
    .then(({ app }) => console.log(`Started on port ${app.server.address().port}`))
    .catch(error => console.error('Error', error));
})();
