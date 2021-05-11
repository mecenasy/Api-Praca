
import { Schema, Document, model } from 'mongoose';
import { Role } from './Role';

export interface IUser {
   user: string;
   hash: string;
   salt: string;
   role: Role;
   personId: any;
   active?: boolean;
   isDefaultPassword?: boolean;
}

const userSchema = new Schema({
   user: {
      type: String,
      unique: true,
   },
   hash: String,
   salt: String,
   personId: {
      type: Schema.Types.ObjectId,
      ref: 'person',
   },
   role: {
      type: String,
      enum: [Role.Admin, Role.Student, Role.Teacher],
      default: Role.Student,
   },
   isDefaultPassword: {
      type: String,
      default: true,
   },
   active: {
      type: Boolean,
      default: true,
   }
});

export default model<IUser & Document>('user', userSchema);
