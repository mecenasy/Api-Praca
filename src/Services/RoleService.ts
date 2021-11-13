import { injectable } from "inversify";
import { Aggregate } from "mongoose";
import RoleModel, { IRole, IRoleModel } from '../Models/Role';

export const RoleServiceType = Symbol.for('RoleService');

@injectable()
export class RoleService {
   constructor() {
      this.menuModel = RoleModel;
   }

   private menuModel: IRoleModel;

   async getRole() {
      const result: IRole[] = await new Aggregate<IRole[]>()
         .model(this.menuModel)
         .project({
            role: 1,
            _id: 0,
         })
         .exec();

      return result;
   }
}
