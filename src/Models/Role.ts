
import { Schema, Document, model } from 'mongoose';

export enum Role {
   Student = 'student',
   Teacher = 'teacher',
   Admin = 'admin',
}

export interface IRole {
   role: Role;
}

const userRoleSchema = new Schema({
   role: Role,
});

export default model<IRole & Document>('role', userRoleSchema);
