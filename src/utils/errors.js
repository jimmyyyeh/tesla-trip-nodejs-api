const ErrorHandler = (error) => {
  error.response.status(error.status)
    .send({
      'error_code': error.code,
      'error_msg': error.message,
    });
  throw error;
};

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
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ResourceConflictError,
  InternalServerError
};
