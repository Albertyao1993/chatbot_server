import express from "express";
import GoogleChat from "./services/googleChat.js";
import router from "./routers/index.js";
export const server = () => {
  const app = express();

  app.use(express.json());

  app.use("/", router);

  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
};
