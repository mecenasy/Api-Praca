import { Response, Request, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { UserService, UserServiceType } from "../Services/UserService";

export const AuthenticateType = Symbol.for('Authenticate');

@injectable()
export class Authenticate extends BaseMiddleware {
   @inject(UserServiceType) private readonly service: UserService

   public async handler(req: Request, res: Response, next: NextFunction) {
      const authorization = req.headers.authorization?.split(' ');

      if (authorization?.length === 2 && authorization[1].match(/\S+\.\S+\.\S+/)) {
         const token = authorization[1];
         const publicKey = fs.readFileSync(path.join(__dirname, 'rsa_pub.pem'));
         try {
            const verify = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
            if (typeof verify === 'object') {
               const { sub } = verify as any;
               await this.service.findUserById(sub);

               const user = this.service.getUser()

               if (user) {
                  req.user = user
               } else {
                  return res.status(401)
                     .send({
                        loggedIn: false,
                        message: 'you are not authorized'
                     });
               }
            }

            next()
         } catch (error) {
            res.status(401)
               .send({
                  loggedIn: false,
                  message: 'you are not authorized'
               });
         }
      } else {
         res.status(401)
            .send({
               loggedIn: false,
               message: 'you are not authorized'
            });
      }
   };
}