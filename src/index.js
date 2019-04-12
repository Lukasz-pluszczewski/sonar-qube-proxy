import config from './config';
import routes from './routes';

import createSonarQube from './services/sonarQubeService';
import createInflux from './services/InfluxService';
import createGoogleSheets from './services/sheetService';

import simpleExpress from 'services/simpleExpress/simpleExpress';

(async function() {
  const sonarQube = await createSonarQube({ sonarQubeUrl: config.sonarQubeUrl, apiKey: config.sonarQubeKey });
  const influx = await createInflux();
  const googleSheets = await createGoogleSheets(config);

  simpleExpress({
    port: config.port,
    routes,
    routeParams: { sonarQube, influx, googleSheets },
    errorHandlers: [
      (error, { originalUrl }) => {
        console.error(`Error in ${originalUrl} route`, error);
        return {
          status: 500,
          body: 'Unknown error',
        };
      },
    ],
  })
    .then(({ app }) => console.log(`Started on port ${app.server.address().port}`))
    .catch(error => console.error('Error', error));
})();
