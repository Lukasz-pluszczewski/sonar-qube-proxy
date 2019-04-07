const Influx = require('influx');

const InfluxService = () => {
  const influx = new Influx.InfluxDB({
    host: 'http://influx.foobarbaz.ovh',
    database: 'test_database',
    schema: [
      {
        measurement: 'test_measurement',
        fields: {
          path: Influx.FieldType.STRING,
          duration: Influx.FieldType.INTEGER,
        },
        tags: [
          'host',
        ],
      },
    ],
  });

  // influx.writePoints([
  //   {
  //     measurement: 'test_measurement',
  //     tags: { host: 'lala' },
  //     fields: { duration: 100, path: 'foo' },
  //   },
  // ])
  //   .then(() => {
  //     return influx.query(`
  //       select * from response_times
  //       where host = ${Influx.escape.stringLit('lala')}
  //       order by time desc
  //       limit 10
  //     `);
  //   })
  //   .then(rows => {
  //     rows.forEach(row => console.log(`A request to ${row.path} took ${row.duration}ms`));
  //   })
  //   .catch(error => console.log('error', error));

  const influxInstance = {
    metrics: {},
    saveMetrics: (project, data, metrics) => {
      influxInstance.metrics[project] = data;
    },
  };

  return influxInstance;
};

export default InfluxService;
