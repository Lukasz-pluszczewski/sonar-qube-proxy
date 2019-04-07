import authenticate from '../middleware/authenticate';
import config from '../config';

const sonarQube = [
  {
    path: 'metrics/:project?',
    handlers: {
      get: [
        authenticate(({ getHeaders }) => getHeaders('authentication') === config.token),
        async({ params, influxService }) => {
          if (params.project) {
            return {
              status: influxService.metrics[params.project] ? 200 : 404,
              body: influxService.metrics[params.project] || `No metrics for project ${params.project}`,
            };
          }
          return {
            status: 200,
            body: influxService.metrics,
          };
        },
      ],
    },
  },
];

if (process.env.ENV === 'development') {
  sonarQube.push({
    path: '/test/:method',
    handlers: {
      get: async({ params, sonarQube }) => {
        const method = params.method;
        if (!sonarQube[method]) {
          return {
            status: 404,
            body: `Method: ${method} not found`,
          };
        }
        const results = await sonarQube[method]()
          .then(({ data }) => data);

        return {
          status: results.error ? 500 : 200,
          body: results,
        };
      },
    },
  });
}

export default sonarQube;
