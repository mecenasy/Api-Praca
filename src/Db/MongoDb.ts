
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb'
import { Db } from './Db';
import { Store } from 'express-session';
import connectMongo from 'connect-mongo';
import { injectable } from "inversify";

@injectable()
class MongoDBNew extends Db<MongoClient> {
   constructor() {
      super()
      this.url = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@${MONGO_DB_SERVER}/${MONGO_DB_DATA}?retryWrites=true&w=majority`
      this.client = this.connectToDataBase();
   }

   private url: string;
   private client: Promise<MongoClient>;
   public connectToDataBase = async () => {
      const db = await mongoose.connect(
         this.url,
         {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
         },
      );

      return db.connection.getClient();
   }

   getStore(): Store {
      return connectMongo.create({
         clientPromise: this.client,
         collectionName: 'session',
      });
   }
}

export default MongoDBNew;
