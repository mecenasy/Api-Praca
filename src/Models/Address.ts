import { Schema, Document, model, Model } from 'mongoose';

export interface IAddress {
   street: string;
   city: string;
   country: string;
   number: string;
   zipCode: string;
   personId: any;
}

export type AddressDocument = IAddress & Document;
export type IAddressModel = Model<AddressDocument>;

const addressSchema = new Schema<AddressDocument>({
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

export default model<AddressDocument>('address', addressSchema);
