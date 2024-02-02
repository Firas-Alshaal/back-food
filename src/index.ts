import App from "./services/ExpressApp";
import express from "express";
import dbConnection from "./services/Database";
import { PORT } from "./config";

const StartServer = async () => {
  const app = express();
  await dbConnection();
  await App(app);

  app.listen(PORT, async () => {
    console.log(`listen port ${PORT}`);
  });
};

StartServer();
