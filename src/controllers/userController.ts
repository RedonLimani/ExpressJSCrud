import User from "../models/User";             
import { Request, Response } from "express";  
import catchAsync from "../utils/catchAsync";



export const getUsers = catchAsync(async(req: Request, res: Response) =>{
  const Users = await User.find();             
  res.status(200).json({
    status:'success',
    results:Users.length,
    data:{
        Users
    }
  });
})

export async function getUser(req: Request, res: Response) {
  const item = await User.findById(req.params.id);  
  res.json(item);
}

export async function updateUser(req: Request, res: Response) {
  
  const item = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
}
export async function deleteUser(req: Request, res: Response) {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });            
}
