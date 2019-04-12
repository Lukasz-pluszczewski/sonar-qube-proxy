import _ from 'lodash';
import axios from 'axios';

export const LIST_OF_METRICS = [
  // Issues
  'critical_violations',
  'new_critical_violations',
  'major_violations',
  'new_major_violations',
  'minor_violations',
  'new_minor_violations',

  // Reliability
  'bugs',
  'new_bugs',

  // maintainability
  'sqale_rating', // Maintainability rating
  'new_maintainability_rating',
  'new_technical_debt',
  'code_smells',
  'new_code_smells',

  // complexities:
  'cognitive_complexity',

  'function_complexity',
  'file_complexity',
  'class_complexity',
  'complexity_in_functions',
  'complexity_in_classes',

  // size:
  'new_lines',
  'comment_lines',
  'commented_out_code_lines',
  'comment_lines_density',
  'comment_lines_data',

  // coverage
  'overall_coverage',
  'new_overall_coverage',
  'overall_branch_coverage',
  'new_overall_branch_coverage',
  'overall_line_coverage',

  // Duplications
  'duplicated_lines',
  'new_duplicated_lines',
  'duplicated_lines_density',
  'new_duplicated_lines_density',
];

const sonarQubeService = async({ sonarQubeUrl, apiKey }) => {
  const client = axios.create({
    baseURL: `${sonarQubeUrl}api/`,
    auth: {
      username: apiKey,
    },
  });

  const metricsResponse = await client.get('metrics/search');
  const availableMetrics = metricsResponse.data.metrics;

  const sonarQubeInstance = {
    makeRequest: (method, url, options) => {
      return client({
        ...options,
        method,
        url,
      }).catch(error => {
        return { status: error.response.status, error: error.response.data };
      });
    },
    getAvailableMetrics: () => availableMetrics,
    getMetrics: async(project = 'ridebeam-api') => {
      return sonarQubeInstance.makeRequest('get', 'measures/component', {
        params: {
          metricKeys: LIST_OF_METRICS.join(','),
          component: project,
        },
      });
    },
    getAvailableMetricTypes: async() => {
      return sonarQubeInstance.makeRequest('get', 'metrics/types');
    },
    getAvailableMetricDomains: async() => {
      return sonarQubeInstance.makeRequest('get', 'metrics/domains');
    },
    help: async() => {
      return { data: _.filter(Object.keys(sonarQubeInstance), method => method !== 'makeRequest') };
    },
    prepareData: metricsValues => {
      const metricsMap = {};

      LIST_OF_METRICS.forEach(metricName => metricsMap[metricName] = {});
      metricsValues.forEach(metric => {
        if (metricsMap[metric.metric]) {
          metricsMap[metric.metric].value = metric.value;
        }
      });
      availableMetrics.forEach(metric => {
        if (metricsMap[metric.key]) {
          metricsMap[metric.key].type = metric.type;
          metricsMap[metric.key].qualitative = metric.qualitative;
          metricsMap[metric.key].direction = metric.direction;
        }
      });
      return metricsMap;
    },
  };

  return sonarQubeInstance;
};

export default sonarQubeService;
