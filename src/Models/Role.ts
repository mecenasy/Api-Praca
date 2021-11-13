
import { Schema, Document, model, Model } from 'mongoose';

export enum Role {
   Student = 'student',
   Teacher = 'teacher',
   Admin = 'admin',
}

export interface IRole {
   role: Role;
}

export type RoleDocument = IRole & Document;
export type IRoleModel = Model<RoleDocument>;

const userRoleSchema = new Schema<IRole & Document>({
   role: {
      type: String,
      enum: [Role.Admin, Role.Student, Role.Teacher],
   },
});

export default model<IRole & Document>('role', userRoleSchema);
