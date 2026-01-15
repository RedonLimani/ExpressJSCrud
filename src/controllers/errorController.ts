import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

interface MongoError extends Error {
  code?: number;
  errmsg?: string;
  path?: string;
  value?: any;
  errors?: { [key: string]: { message: string } };
}

const handleJWTError=(err: MongoError): AppError => {
    return new AppError('Invalid token,log in',401)
}


const handleJWTExpiredError=(err: MongoError): AppError => {
    return new AppError(' token Expired,log in again',401)
}


const handleCastErrorDB = (err: MongoError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: MongoError): AppError => {
  const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0] || "";
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: MongoError): AppError => {
  const errors = Object.values(err.errors || {}).map((el: any) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err: AppError, res: Response): void => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response): void => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("ERROR 💥", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

export default (
  err: AppError ,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err as AppError, res);
  } else if (process.env.NODE_ENV === "production") {
    let error: AppError | MongoError = { ...err };

    if ((error as MongoError).name === "CastError")
      error = handleCastErrorDB(error as MongoError);
    if ((error as MongoError).code === 11000)
      error = handleDuplicateFieldsDB(error as MongoError);
    if ((error as MongoError).name === "ValidationError")
      error = handleValidationErrorDB(error as MongoError);
    if((error as MongoError).name==='JasonWebTokenError')
        error=handleJWTError(error as MongoError)

    if((error as MongoError).name==='TikenExpiredError')
        error=handleJWTExpiredError(error as MongoError)

    sendErrorProd(error as AppError, res);
  }
};
