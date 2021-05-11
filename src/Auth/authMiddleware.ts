import { RequestHandler } from "express";
import { Role } from "../Models/Role";
import { IUser } from "../Models/User";

export const isAdmin: RequestHandler = (req, res, next) => {
   const user: IUser = req.user as IUser;
   
   if (req.isAuthenticated() && user.role === Role.Admin) {
      next();
   } else {
      res.status(401).send({message: 'Not authorized'});
   }
};
