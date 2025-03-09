import express from "express";
import { chatWithGoogle } from "../controllers/conversationControl.js";
const router = express.Router();

router.post("/", chatWithGoogle);
router.get("/", (req, res) => {
  res.send("You've touch the chat router");
});

export default router;
