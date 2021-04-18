import { json } from "express";
import App from "../src/App/App";
import MenuController from "../src/Controllers/MenuController";
import PersonController from "./Controllers/PersonController";

App.getInstance()
   .setController(new MenuController)
   .setController(new PersonController)
   .setCorse()
   .static()
   .parseBody()
   .connectToDataBase()
   .initializeControllers()
   .serverRun();
