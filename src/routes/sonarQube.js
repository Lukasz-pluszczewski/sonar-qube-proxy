import authenticate from '../middleware/authenticate';
import config from '../config';

const sonarQube = [
  {
    path: '/metrics/',
    handlers: {
      get: [
        async({ prometheus }) => ({
          status: 200,
          body: await prometheus.register.metrics(),
        }),
      ],
    },
  },
  {
    path: '/metrics/:project',
    handlers: {
      get: [
        authenticate(({ getHeader }) => getHeader('authentication') === config.token),
        async({ params }) => {
          const { data } = await sonarQube.getMetrics(params.project);
          const preparedData = sonarQube.prepareData(data.component.measures);
          return {
            status: 200,
            body: preparedData,
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
