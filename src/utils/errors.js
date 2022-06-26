const { errorCodes } = require('../config/error-codes');

class ErrorHandler {
  static error(error) {
    error.response.status(error.status)
      .send({
        'error_code': error.code,
        'error_msg': error.message,
      });
    throw error;
  }
}

class MiddlewareError {
  static methodNotAllow(request, response) {
    ErrorHandler.error(new UnprocessableEntityError(response, 'method not allow', errorCodes.METHOD_NOT_ALLOW));
  }

  static notFoundError(request, response) {
    ErrorHandler.error(new NotFoundError(response, 'url not found', errorCodes.URL_NOT_FOUND));
  }
}

class BadRequestError extends Error {
  constructor(response, message, code) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.response = response;
    this.message = message;
    this.code = code;
    this.status = 400;
  }
}

class UnauthorizedError extends Error {
  constructor(response, message, code) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.response = response;
    this.message = message;
    this.code = code;
    this.status = 401;
  }
}

class NotFoundError extends Error {
  constructor(response, message, code) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.response = response;
    this.message = message;
    this.code = code;
    this.status = 404;
  }
}

class ResourceConflictError extends Error {
  constructor(response, message, code) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.response = response;
    this.message = message;
    this.code = code;
    this.status = 409;
  }
}

class UnprocessableEntityError extends Error {
  constructor(response, message, code) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.response = response;
    this.message = 'method not allow';
    this.code = code;
    this.status = 422;
  }
}

class InternalServerError extends Error {
  constructor(response, message, code) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.response = response;
    this.message = 'internal server error';
    this.code = code;
    this.status = 500;
  }
}

module.exports = {
  ErrorHandler,
  MiddlewareError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ResourceConflictError,
  UnprocessableEntityError,
  InternalServerError
};
