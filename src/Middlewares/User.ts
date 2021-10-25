import { Response, Request, NextFunction } from "express";
import { injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";

export const UserType = Symbol.for('User');

@injectable()
export class User extends BaseMiddleware {
   public async handler({ user, params, isAuthenticated }: Request, res: Response, next: NextFunction) {
      if (isAuthenticated() && user.personId === params.personId) {
         next();
      } else {
         res.status(400).send({ message: 'bad request' });
      }
   };
}