import express from "express";

export const server = () => {
  const app = express();

  app.get("/", (req, res) => {
    res.send("Hello World");
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
};
