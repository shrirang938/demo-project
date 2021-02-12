const AppError = require("./../utils/appError");

const handleCatchError = (err) => {
  const mes = `Invalid ${err.path}: ${err.value}`;
  return new AppError(mes, 400);
};

const handleDuplicateFiles = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  // console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("Error", err);

    res.status(500).json({
      status: "error",
      message: "Something went wrong !",
    });
  }
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // vkfbnonmbobmbb
  // skvnsbsibgnsbpifsbnfb;fnbdglgdndgndg
  // bdgbdgmbnobnbnpbnbk;bmnanl'nm

  err.status = err.status || "error";

  if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (error.name === "CastError") error = handleCatchError(error);

    if (error.code === 11000) error = handleDuplicateFiles(error);

    if (error.name === "ValidationError") error = handleValidationError(error);

    sendErrorProd(error, res);
  } else if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  }
};
