
import { Schema, Document, model } from 'mongoose';

export enum Role {
   Student = 'student',
   Teacher = 'teacher',
   Admin = 'admin',
}

export interface IRole {
   role: Role;
}

const userRoleSchema = new Schema<IRole & Document>({
   role: {
      type: String,
      enum: [Role.Admin, Role.Student, Role.Teacher],
   },
});

export default model<IRole & Document>('role', userRoleSchema);
