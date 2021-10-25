import { Schema, Document, model } from 'mongoose';

export enum Specialty {
   Programming = 'Programowanie',
   Networks = 'Sieci',
}

export interface ISpecialty {
   specialty: Specialty;
}

const specialtySchema = new Schema<ISpecialty & Document>({
   specialty: {
      type: String,
      enum: [Specialty.Programming, Specialty.Networks],
   },
});

export default model<ISpecialty & Document>('specialty', specialtySchema);
