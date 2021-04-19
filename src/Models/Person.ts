import { Schema, Document, model } from "mongoose";
import { Direction } from "./Direction";
import { Specialty } from "./Specialty";
import { IAddress } from "./Address";
import { Role } from "./Role";
import { imageUrl } from "../helpers/hostUrlHelpers";

export interface Person extends Omit<IPerson, 'active' | 'album' | 'addressId'> {
   address: IAddress;
   role: Role;
}
export interface IPerson {
   album: number;
   direction: Direction;
   specialty: Specialty;
   year: string;
   semester: string;
   group: string;
   name: string;
   surname: string;
   email: string;
   phone: number;
   photo?: string;
   addressId?: any;
   active: boolean;
}

const personSchema = new Schema({
   album: Number,
   direction: {
      type: String,
      enum: [Direction.Informatics, Direction.Management],
   },
   specialty: {
      type: String,
      enum: [Specialty.Programming, Specialty.Networks],
   },
   year: String,
   semester: String,
   group: String,
   name: String,
   surname: String,
   email: String,
   phone: Number,
   photo: {
      type: String,
      get: imageUrl,
   },
   addressId: {
      type: Schema.Types.ObjectId,
      ref: 'address',
   },
   active: {
      type: Boolean,
      default: true,
   }
});

export default model<IPerson & Document>('person', personSchema);
