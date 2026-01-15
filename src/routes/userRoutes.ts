import { Router } from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router = Router();

router.get("/", getUser);

router.get("/:id", getUsers);

router.patch("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;
