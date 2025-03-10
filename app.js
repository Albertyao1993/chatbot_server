import dotenv from "dotenv";

// 加载环境变量
dotenv.config();

import { server } from "./server.js";
import { connectDB } from "./config/database.js";

function main() {
  // 启动服务器
  server();
  
  // 连接数据库
  connectDB();
  
  console.log("聊天机器人服务器已启动");
}

main();
