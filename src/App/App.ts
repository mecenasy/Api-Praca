import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import { MongoClient } from 'mongodb'
import { Db } from '../Db/Db';
import { RegistryService } from '../RegistryServices/RegistryService';
import { InversifyExpressServer } from 'inversify-express-utils';
import fileUpload from 'express-fileupload';

class App {
   constructor() {
      this.service = new RegistryService();
      this.server = new InversifyExpressServer(this.service.getContainer());
      this.server.setConfig(this.configure);
      this.app = this.server.build();
      this.port = process.env.PORT || PORT;
   }

   private server: InversifyExpressServer;
   private service: RegistryService;
   private static instance: App;
   private app: Application;
   private port: number;

   private configure = (app: Application) => {
      this.setCorse(app)
         .parseBody(app)
         .cookieParser(app)
         .setStaticRouter(app);

      this.connectToDataBase(app);
   }

   private parseBody = (app: Application): App => {
      app.use(fileUpload());
      app.use(express.urlencoded({ extended: true }));
      app.use(express.json());

      return this;
   }


   private connectToDataBase = async (app: Application) => {
      const store = this.service.getService<Db<MongoClient>>(Db).getStore();
      if (!DEV) {
         app.use((req, res, next) => {
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header("Access-Control-Allow-Origin", CORS_ORIGIN_PATH);
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
            res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");

            next();
         });

         app.use(session({
            secret: SESSION_SECRET,
            resave: true,
            saveUninitialized: true,
            store,
            proxy: true,
            cookie: {
               maxAge: 1000 * 60 * 60, // ms * s * m
               httpOnly: false,
               sameSite: 'none',
               secure: true,
            },
         }));
      }
   }

   private setCorse = (app: Application): App => {
      app.use(cors({
         origin: [CORS_ORIGIN_PATH],
         optionsSuccessStatus: 200,
         credentials: true,
      }));

      return this;
   }

   private setStaticRouter = (app: Application): App => {
      app.use(
         '/assets',
         express.static(
            path.resolve(__dirname, '../build/assets'),
         ),
      );

      return this;
   }

   private cookieParser = (app: Application): App => {
      app.use(cookieParser());

      return this;
   }

   public serverRun = () => {
      this.app.listen(this.port, () => {
         console.log(`Server Api started on port ${this.port}`);
      });
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
