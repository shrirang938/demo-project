class AppError extends Error {
  constructor(message, statusCode) {
    super(message, message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    // this is a commmetn man

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
