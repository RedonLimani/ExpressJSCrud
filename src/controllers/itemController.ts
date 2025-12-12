import Item from "../models/Item";             
import { Request, Response } from "express";   

export async function createItem(req: Request, res: Response) {
  const item = await Item.create(req.body);    
  res.json(item);                              
}

export async function getItems(req: Request, res: Response) {
  const items = await Item.find();             
  res.json(items);                             
}

export async function getItem(req: Request, res: Response) {
  const item = await Item.findById(req.params.id);  
  res.json(item);
}

export async function updateItem(req: Request, res: Response) {
  
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
}
export async function deleteItem(req: Request, res: Response) {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });            
}
