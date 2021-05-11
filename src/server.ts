import App from "../src/App/App";
import MenuController from "../src/Controllers/MenuController";
import { generateKeyPair } from "./Auth/generateKeyPair";
import AuthController from "./Controllers/AuthController";
import PersonController from "./Controllers/PersonController";

generateKeyPair();

App.getInstance()
   .setController(new MenuController)
   .setController(new PersonController)
   .setController(new AuthController)
   .initializeControllers()
   .serverRun();
