import { Router } from "express";  
import {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem
} from "../controllers/itemController";

const router = Router();

router.post("/", createItem);

router.get("/", getItems);

router.get("/:id", getItem);

router.patch("/:id", updateItem);

router.delete("/:id", deleteItem);

export default router;  
