import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routers/index.js";

export const server = () => {
  const app = express();

  // 中间件
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({
    origin: '*', // 前端应用的URL
    credentials: true, // 允许跨域请求携带cookie
  }));

  // 路由
  app.use("/api", router);

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
  });

  return app;
};
