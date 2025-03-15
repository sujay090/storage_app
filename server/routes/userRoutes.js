import express from "express";
import checkAuth from "../middlewares/authMiddleware.js";
import { getUserData, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register",registerUser);
  // transactionCommit()
router.post("/login", loginUser);

router.get("/",checkAuth,getUserData);

router.post("/logout", logoutUser);

export default router;
