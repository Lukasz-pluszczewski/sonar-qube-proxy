const healthRoutes = [
  {
    path: '*',
    handlers: {
      get: () => ({
        status: 404,
        body: 'Not found',
      }),
    },
  },
];

export default healthRoutes;
