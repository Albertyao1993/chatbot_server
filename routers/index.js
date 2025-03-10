import express from "express";
import chatRouter from "./chatRouters.js";
import userRouter from "./userRouters.js";

const router = express.Router();

// 聊天相关路由
router.use("/chat", chatRouter);

// 用户相关路由
router.use("/users", userRouter);

router.get("/", (req, res) => {
  res.send("聊天机器人API服务器");
});

export default router;
