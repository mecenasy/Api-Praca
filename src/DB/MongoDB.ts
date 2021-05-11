import mongoose, { Connection } from 'mongoose';
import { MongoClient } from 'mongodb'
class MongoDB {
   constructor() {
      this.mongoUrl = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@${MONGO_DB_SERVER}/${MONGO_DB_DATA}?retryWrites=true&w=majority`
      this.client = this.connectToDataBase();
   }

   private static instance: MongoDB;

   public client: Promise<MongoClient>
   public connection: Connection | undefined
   public mongoUrl: string;

   public connectToDataBase = async () => {
      const db = await mongoose.connect(
         this.mongoUrl,
         {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
         },
      );

      this.connection = db.connection
      
      return db.connection.getClient();
   }

   public static getInstance = () => {
      if (MongoDB.instance) {
         return MongoDB.instance;
      }

      MongoDB.instance = new MongoDB();

      return MongoDB.instance;
   }
}

export default MongoDB;
