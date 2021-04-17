import { json } from "express";
import App from "../src/App/App";
import MenuController from "../src/Controllers/MenuController";

App.getInstance()
   .setController(new MenuController)
   .setCorse()
   .static()
   .parseBody()
   .connectToDataBase()
   .initializeControllers()
   .serverRun();
console.log("🚀 ~ file: server.ts ~ line 13 ~ process.env.HOSTNAME", process.env.HOSTNAME)
