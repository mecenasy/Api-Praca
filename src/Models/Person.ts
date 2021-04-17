import { Schema, Document, model } from "mongoose";

export interface IPerson {
   userId?: any;
   personId?: any;
   album: number;
   direction: string;
   department: string;
   specialty: string;
   year: string;
   semester: string;
   group: string;
   name: string;
   surname: string;
   email: string;
   phone: number;
   photo: string;
   role?: string;
}

const personSchema = new Schema({
   userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
   },
   album: Number,
   direction: String,
   department: String,
   specialty: String,
   year: String,
   semester: String,
   group: String,
   name: String,
   surname: String,
   email: String,
   phone: Number,
   photo: String,
});

export default model<IPerson & Document>('person', personSchema);
