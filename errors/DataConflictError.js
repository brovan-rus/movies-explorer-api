class DataConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DataConflictError';
    this.errCode = 409;
  }
}

module.exports = DataConflictError;
