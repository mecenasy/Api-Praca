import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import MongoDB from '../DB/MongoDB';
import { IController } from '../Interface/IController';

class App {
   constructor() {
      this.app = express();
      this.controllers = [];
      this.port = process.env.PORT || PORT;

      this.configure();
   }

   private static instance: App;
   private app: Application;
   private controllers: IController[];
   private port: number;

   private configure = () => {
      this.setCorse()
         .parseBody()
         .cookieParser()

      this.connectToDataBase();

      this.setStaticRouter();
   }

   private parseBody = (): App => {
      this.app.use(express.urlencoded({ extended: true }));
      this.app.use(express.json());

      return this;
   }


   private connectToDataBase = async () => {
      const mongodb = MongoDB.getInstance();

      const SessionStore = connectMongo.create({
         clientPromise: mongodb.client,
         collectionName: 'session',
      });

      this.app.use(session({
         secret: SESSION_SECRET,
         resave: true,
         saveUninitialized: true,
         store: SessionStore,
         cookie: {
            maxAge: 1000 * 60 * 60, // ms * s * m
         },
      }));
   }

   private setCorse = (): App => {
      this.app.use(cors({
         origin: [CORS_ORIGIN_PATH],
         optionsSuccessStatus: 200,
         credentials: true,
      }));

      return this;
   }

   private setStaticRouter = (): App => {
      this.app.use(
         '/assets',
         express.static(
            path.resolve(__dirname, '../assets'),
         ),
      );

      return this;
   }

   private cookieParser = (): App => {
      this.app.use(cookieParser());

      return this;
   }

   public setController = (controller: IController) => {
      this.controllers.push(controller);

      return this;
   }

   public serverRun = () => {
      this.app.listen(this.port, () => {
         console.log(`Server Api started on port ${this.port}`);
      });
   }

   public initializeControllers = () => {
      this.controllers.forEach((controller) => {
         this.app.use(controller.router);
      });

      return this;
   }

   public static getInstance = () => {
      if (App.instance) {
         return App.instance;
      }

      App.instance = new App();

      return App.instance;
   }
}

export default App;
