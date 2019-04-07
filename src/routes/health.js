const healthRoutes = [
  {
    path: '/health',
    handlers: {
      get: () => ({
        body: {
          status: 'healthy',
        },
      }),
    },
  },
];

export default healthRoutes;
