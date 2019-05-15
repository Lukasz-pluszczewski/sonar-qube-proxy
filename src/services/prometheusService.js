/* eslint-disable camelcase */
import Prometheus from 'prom-client';

import { LIST_OF_METRICS } from './sonarQubeService';

const types = {
  GAUGE: 'gauge',
};

const metricTypes = {
  // Issues
  critical_violations: types.GAUGE,
  new_critical_violations: types.GAUGE,
  major_violations: types.GAUGE,
  new_major_violations: types.GAUGE,
  minor_violations: types.GAUGE,
  new_minor_violations: types.GAUGE,

  // Reliability
  bugs: types.GAUGE,
  new_bugs: types.GAUGE,

  // maintainability
  sqale_rating: types.GAUGE, // Maintainability rating
  new_maintainability_rating: types.GAUGE,
  new_technical_debt: types.GAUGE,
  code_smells: types.GAUGE,
  new_code_smells: types.GAUGE,

  // complexities:
  cognitive_complexity: types.GAUGE,

  function_complexity: types.GAUGE,
  file_complexity: types.GAUGE,
  class_complexity: types.GAUGE,
  complexity_in_functions: types.GAUGE,
  complexity_in_classes: types.GAUGE,

  // size:
  new_lines: types.GAUGE,
  comment_lines: types.GAUGE,
  commented_out_code_lines: types.GAUGE,
  comment_lines_density: types.GAUGE,
  comment_lines_data: types.GAUGE,

  // coverage
  coverage: types.GAUGE,
  overall_coverage: types.GAUGE,
  new_overall_coverage: types.GAUGE,
  overall_branch_coverage: types.GAUGE,
  new_overall_branch_coverage: types.GAUGE,
  overall_line_coverage: types.GAUGE,

  // Duplications
  duplicated_lines: types.GAUGE,
  new_duplicated_lines: types.GAUGE,
  duplicated_lines_density: types.GAUGE,
  new_duplicated_lines_density: types.GAUGE,
};

const PrometheusService = () => {
  const PrometheusMetrics = LIST_OF_METRICS.reduce((result, metric) => {
    const type = metricTypes[metric];
    switch (type) {
      case types.GAUGE:
        result[metric] = new Prometheus.Gauge({ name: `sonarQube_${metric}`, help: metric, labelNames: ['project'] });
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
            PrometheusMetrics[metric].set({ project }, data[metric].value ? parseFloat(data[metric].value) : 0);
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
