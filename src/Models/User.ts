
import { Schema, Document, model } from 'mongoose';
import { Role } from './Role';

export interface IUser {
   user: string;
   password: string;
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
   password: String,
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

const userModel = model<IUser & Document>('user', userSchema);

export default userModel;
