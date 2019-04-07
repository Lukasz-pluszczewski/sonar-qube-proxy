const healthRoutes = [
  {
    path: '*',
    handlers: {
      get: () => ({
        status: 404,
        body: {
          message: 'Not found',
        },
      }),
    },
  },
];

export default healthRoutes;
