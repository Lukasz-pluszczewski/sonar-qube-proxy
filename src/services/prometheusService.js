import Prometheus from 'prom-client';
import _ from 'lodash';

import { LIST_OF_METRICS } from './sonarQubeService';

const types = {
  GAUGE: 'gauge',
};

const metricTypes = {
  // Issues
  'critical_violations': types.GAUGE,
  'new_critical_violations': types.GAUGE,
  'major_violations': types.GAUGE,
  'new_major_violations': types.GAUGE,
  'minor_violations': types.GAUGE,
  'new_minor_violations': types.GAUGE,

//   // Reliability
//   'bugs',
//   'new_bugs',

//   // maintainability
//   'sqale_rating', // Maintainability rating
//   'new_maintainability_rating',
//   'new_technical_debt',
//   'code_smells',
//   'new_code_smells',

//   // complexities:
//   'cognitive_complexity',

//   'function_complexity',
//   'file_complexity',
//   'class_complexity',
//   'complexity_in_functions',
//   'complexity_in_classes',

//   // size:
//   'new_lines',
//   'comment_lines',
//   'commented_out_code_lines',
//   'comment_lines_density',
//   'comment_lines_data',

//   // coverage
//   'overall_coverage',
//   'new_overall_coverage',
//   'overall_branch_coverage',
//   'new_overall_branch_coverage',
//   'overall_line_coverage',

//   // Duplications
//   'duplicated_lines',
//   'new_duplicated_lines',
//   'duplicated_lines_density',
//   'new_duplicated_lines_density',
};

const PrometheusService = () => {
  const PrometheusMetrics = LIST_OF_METRICS.reduce((result, metric) => {
    const type = metricTypes[metric];
    switch (type) {
      case types.GAUGE:
        result[metric] = new Prometheus.Gauge({ name: metric, help: metric, labelNames: ['project'] });
        break;
      default:
        break;
    }
    return result;
  }, {});

  const prometheusInstance = {
    register: Prometheus.register,
    saveMetrics: ({ data, project }) => {
      Object.keys(PrometheusMetrics).forEach(metric => {
        switch (metricTypes[metric]) {
          case types.GAUGE:
            PrometheusMetrics[metric].set({ project }, data[metric].value ? parseInt(data[metric].value) : 0);
            break;
          default:
            break;
        }
      });
    },
  };

  return prometheusInstance;
};

export default PrometheusService;
