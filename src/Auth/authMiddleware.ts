import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { RequestHandler } from "express";
import { Role } from "../Models/Role";
import UserModel, { IUser } from "../Models/User";

export const isAdmin: RequestHandler = (req, res, next) => {
   const user: IUser = req.user as IUser;

   if (req.isAuthenticated() && user.role === Role.Admin) {
      next();
   } else {
      res.status(401).send({ message: 'Not authorized' });
   }
};

export const authenticate: RequestHandler = async (req, res, next) => {
   console.log("🚀 ~ file: authMiddleware.ts ~ line 19 ~ constauthenticate:RequestHandler= ~ req", req.originalUrl)
   if (req.cookies['jwt']?.match(/\S+\.\S+\.\S+/)) {
      const token = req.cookies['jwt'];
      const publicKey = fs.readFileSync(path.join(__dirname, 'rsa_pub.pem'));
      try {
         const verify = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
         if (typeof verify === 'object') {
            const { sub } = verify as any;
            const user = await UserModel.findById(sub);

            if (user) {
               req.user = user
            } else {

            }
         }

         next()
      } catch (error) {
         res.status(401).send({ loggedIn: false, message: 'you are not authorized' },);
      }
   } else {
      res.status(401).send({ loggedIn: false, message: 'you are not authorized' },);
   }
};