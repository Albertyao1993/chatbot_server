import express from "express";
import chatRouter from "./chatRouters.js";

const router = express.Router();

router.use("/chat", chatRouter);

router.get("/", (req, res) => {
  res.send("Hello World");
});

export default router;
