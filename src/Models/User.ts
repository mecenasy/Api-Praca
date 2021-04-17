
import { Schema, Document, model } from 'mongoose';

export interface IUser {
   user: string;
   password: string;
   role: any;
   personId: any;
   isDefaultPassword?: boolean;
}

const userSchema = new Schema({
   user: String,
   password: String,
   personId: {
      type: Schema.Types.ObjectId,
      ref: 'person',
   },
   role: {
      type: Schema.Types.ObjectId,
      ref: 'role',
   },
   isDefaultPassword: Boolean,
});

const userModel = model<IUser & Document>('user', userSchema);

export default userModel;
