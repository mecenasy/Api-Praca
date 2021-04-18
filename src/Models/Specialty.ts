import { Schema, Document, model } from 'mongoose';

export enum Specialty {
   Programming = 'programming',
   Networks = 'networks',
}

export interface ISpecialty {
   specialty: Specialty;
}

const specialtySchema = new Schema({
   specialty: {
      type: String,
      enum: [Specialty.Programming, Specialty.Networks],
   },
});

export default model<ISpecialty & Document>('specialty', specialtySchema);
