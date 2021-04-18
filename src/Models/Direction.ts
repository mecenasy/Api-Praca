import { Schema, Document, model } from 'mongoose';

export enum Direction {
   Informatics = 'informatics',
   Management = 'management',
}

export interface IDirection {
   direction: Direction;
}

const directionSchema = new Schema({
   direction: {
      type: String,
      enum: [Direction.Informatics, Direction.Management],
   },
});

export default model<IDirection & Document>('direction', directionSchema);
