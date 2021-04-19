import { Schema, Document, model } from 'mongoose';

export interface IAddress {
   street: string;
   city: string;
   country: string;
   number: string;
   zipCode: string;
   personId: any;
}

const addressSchema = new Schema({
   street: String,
   number: String,
   city: String,
   country: String,
   zipCode: String,
   personId: {
      type: Schema.Types.ObjectId,
      ref: 'person',
   },
});

export default model<IAddress & Document>('address', addressSchema);
