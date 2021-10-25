
import { Schema, Document, model, Model } from 'mongoose';
import { Role } from './Role';

export type UserDocument = IUser & Document;
export type IUserModel = Model<UserDocument>;

const userSchema = new Schema<UserDocument>({
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
      type: Boolean,
      default: true,
   },
   active: {
      type: Boolean,
      default: true,
   }
});

export default model<UserDocument>('user', userSchema);
