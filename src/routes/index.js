import health from './health';
import notFound from './notFound';
import sonarQube from './sonarQube';
import webhook from './webhook';

const routes = [
  ...sonarQube,
  ...webhook,
  ...health,
  ...notFound,
];

export default routes;
