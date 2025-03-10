import express from "express";
import { register, login, getCurrentUser } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// 注册新用户
router.post("/register", register);

// 用户登录
router.post("/login", login);

// 获取当前登录用户信息 (需要认证)
router.get("/me", protect, getCurrentUser);
router.get("/", (req, res) => {
    console.log("userRouters")
    res.send("userRouters")
})

export default router; 