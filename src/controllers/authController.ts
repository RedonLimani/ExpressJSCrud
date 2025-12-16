import jwt from "jsonwebtoken";
import User  from "../models/User";
import {promisify} from 'util'
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as any;

export const signUp = catchAsync(async (req: Request, res: Response) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  res.status(201).json({ status: "success", token, data: { user: newUser } });
});

export const logIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Provide email and passowrd", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user?.correctPassword(password, user.password))) {
      return next(new AppError("incorrect email or password", 401));
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    res.status(200).json({
      status: "success",
      token,
    });
  }
);

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new AppError("You are not logged in", 401));
    }

    const decoded = await promisify(jwt.verify as any)(token, JWT_SECRET);
    

    const freshUser = await User.findById(decoded.id);
    if(!freshUser){
      return next(new AppError('user no longer exists',401));
    }

    if(await freshUser.changePasswordAfter(decoded.iat))
    {
      return next(new AppError("Password  changed log in again", 401));
    }
    req.user=freshUser
    next();
  }
);
