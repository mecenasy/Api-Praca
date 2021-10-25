import { injectable } from "inversify";
import { generatePassword } from "../Auth/passwordUtils";
import { PersonDocument } from "../Models/Person";
import { Role } from "../Models/Role";
import UserModel, { UserDocument, IUserModel } from '../Models/User';

export const UserServiceType = Symbol.for('UserService');

@injectable()
export class UserService {
   constructor() {
      this.userModel = UserModel;
      this.user = null;
   }

   userModel: IUserModel;
   private user: UserDocument | null;

   public isExist() {
      return !!this.user;
   }

   public async getUserName(name: string, surname: string) {
      let userName = (name.slice(0, 3) + surname).toLocaleLowerCase();

      const existingUser = await this.userModel.find({ user: userName });

      if (existingUser?.length) {
         return `${userName}${existingUser.length + 1}`;
      }
      return userName
   }

   public async findUser(name: string) {
      this.user = await this.userModel.findOne({ user: name });
      return this;
   }

   public async findUserById(id: string) {
      this.user = await this.userModel.findById(id);

      return this;
   }

   public async updatePassword(newPassword: string) {
      if (!this.user) {
         throw new Error('you must first find the user')
      }

      const { hash, salt } = generatePassword(newPassword);

      this.user.hash = hash
      this.user.salt = salt
      this.user.isDefaultPassword = false;

      await this.save();

      return this;
   }
   public async deleteUser(userName: string) {
      await this.findUser(userName);

      if (!this.user) {
         throw new Error('you must first find the user')
      }

      this.user.active = false;

      await this.save();

      return this;
   }

   public async addUser(name: string, role: Role, personDoc: PersonDocument) {
      const { hash, salt } = generatePassword('user1234');

      this.user = new UserModel({
         role,
         user: name,
         personId: personDoc,
         hash,
         salt,
      });

      await this.save();
   }

   private async save() {
      if (!this.user) {
         throw new Error('you must first find the user')
      }

      await this.user.save();
      this.user = null;
      return this;
   }

   public getUser(): UserDocument {
      if (!this.user) {
         throw new Error('you must first find the user')
      }

      return this.user;
   }
}
