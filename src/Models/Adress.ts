import { Schema, Document, model } from 'mongoose';

export interface IAddress {
   personId: any;
   street: string;
   city: string;
   country: string;
   zipCode: string;
}

const addressSchema = new Schema({
   personId: String,
   street: String,
   city: String,
   country: String,
   zipCode: String,
});

export default model<IAddress & Document>('specialty', addressSchema);
