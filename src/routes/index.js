import health from './health';
import notFound from './notFound';
import sonarQube from './sonarQube';

const routes = [
  ...sonarQube,
  ...health,
  ...notFound,
];

export default routes;
