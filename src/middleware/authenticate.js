const authenticate = authenticator => async args => {
  const { next } = args;
  if (await authenticator(args)) {
    return next();
  }
  return {
    status: 401,
    body: { message: 'Unauthenticated' },
  };
};

export default authenticate;
