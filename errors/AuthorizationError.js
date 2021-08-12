class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthorizationError';
    this.errCode = 401;
  }
}

module.exports = AuthorizationError;
