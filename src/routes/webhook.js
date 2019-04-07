import authenticate from '../middleware/authenticate';
import config from '../config';

const sonarQube = [
  {
    path: '/webhook/:token',
    handlers: {
      post: [
        authenticate(({ params }) => params.token === config.webhookToken),
        async ({ body, params, sonarQube, influx }) => {
          const project = body?.project?.key;
          if (!project) {
            return {};
          }

          const data = await sonarQube.getMetrics(project);
          const availableMetrics = await sonarQube.getAvailableMetrics();
          await influx.saveMetrics(project, data, availableMetrics);

          return {
            status: 200,
          };
        }
      ],
    },
  },
];

export default sonarQube;
