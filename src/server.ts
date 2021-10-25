import 'reflect-metadata';
import App from "../src/App/App";
import { generateKeyPair } from "./Auth/generateKeyPair";

generateKeyPair();

App.getInstance()
   .serverRun();
