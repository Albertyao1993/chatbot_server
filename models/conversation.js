import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "New Conversation",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
});

// 添加索引以加快查询速度
conversationSchema.index({ userId: 1, updatedAt: -1 });

export const Conversation = mongoose.model("Conversation", conversationSchema);
