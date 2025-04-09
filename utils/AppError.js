class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);

    // Ensure the name property is set correctly.  Helpful for debugging.
    this.name = this.constructor.name;
  }
}

module.exports = AppError;
