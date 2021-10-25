import { Schema, Document, model } from 'mongoose';

export enum Direction {
   Informatics = 'Informatyka',
   Management = 'Zarządzanie',
}

export interface IDirection {
   direction: Direction;
}

const directionSchema = new Schema<IDirection & Document>({
   direction: {
      type: String,
      enum: [Direction.Informatics, Direction.Management],
   },
});

export default model<IDirection & Document>('direction', directionSchema);
