import { Response, Request, NextFunction } from "express";
import { injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { Role } from "../Models/Role";

export const AdminType = Symbol.for('Admin');

@injectable()
export class Admin extends BaseMiddleware {
   public async handler(req: Request, res: Response, next: NextFunction) {
      const user: IUser = req.user;

      if (req.isAuthenticated() && user.role === Role.Admin) {
         next();
      } else {
         res.status(401).send({ message: 'Not authorized' });
      }
   };
}