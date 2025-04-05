class AppError extends Error {
  constructor(message, statusCode, status) {
    super(message);

    this.statusCode = statusCode;
    this.status = ` ${status}`.startsWith(4) ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constractor);
  }
}
module.exports = AppError;
