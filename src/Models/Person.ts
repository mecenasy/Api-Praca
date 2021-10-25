import { Schema, Document, model, Model } from "mongoose";
import { Direction } from "./Direction";
import { Specialty } from "./Specialty";
import { IAddress } from "./Address";
import { Role } from "./Role";

export interface Person extends Omit<IPerson, 'album'> {
   address: IAddress;
   role: Role;
}
export type PersonDocument = IPerson & Document;
export type IPersonModel = Model<PersonDocument>;
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
}

const personSchema = new Schema<PersonDocument>({
   album: {
      type: Number,
      unique: true,
   },
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
   photo: String,
});

export default model<PersonDocument>('person', personSchema);
