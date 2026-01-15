import { Router } from "express";  
import {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem
} from "../controllers/itemController";

import {protect} from '../controllers/authController'

const router = Router();

router.post("/", createItem);

router.get("/", protect,getItems);

router.get("/:id", getItem);

router.patch("/:id", updateItem);

router.delete("/:id", deleteItem);

export default router;  
