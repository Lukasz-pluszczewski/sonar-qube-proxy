import { LIST_OF_METRICS } from './sonarQubeService';
import axios from 'axios';

const sheetService = config => {
  const client = axios.create({
    baseURL: `${config.sheetsUrl}`,
  });

  const sheetInstance = {
    prepareData: data => LIST_OF_METRICS.map(metricName => data[metricName].value),
    sendData: (projectName, data) => {
      const date = (new Date()).toISOString();
      const dataToSend = [[projectName, date, ...sheetInstance.prepareData(data)]];

      client({
        method: 'post',
        data: dataToSend,
        params: {
          project: projectName,
          date,
        },
      });
    },
  };

  return sheetInstance;
};

export default sheetService;
