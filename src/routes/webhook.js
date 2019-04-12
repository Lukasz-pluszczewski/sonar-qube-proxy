import authenticate from '../middleware/authenticate';
import config from '../config';

const sonarQube = [
  {
    path: '/webhook/:token',
    handlers: {
      post: [
        authenticate(({ params }) => console.log('auth', params) || params.token === config.webhookToken),
        async ({ body, params, sonarQube, googleSheets }) => {

          const project = body?.project?.key;
          if (!project) {
            return {};
          }

          const { data } = await sonarQube.getMetrics(project);
          const preparedData = sonarQube.prepareData(data.component.measures);

          // sending data to spreadsheet
          googleSheets.sendData(project, preparedData);

          return {
            status: 200,
            body: preparedData,
          };
        }
      ],
    },
  },
];

export default sonarQube;
