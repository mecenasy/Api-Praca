import { Schema, Document, model } from 'mongoose';

export interface IAddress {
   street: string;
   city: string;
   country: string;
   number: string;
   zipCode: string;
}

const addressSchema = new Schema({
   street: String,
   number: String,
   city: String,
   country: String,
   zipCode: String,
});

export default model<IAddress & Document>('address', addressSchema);
