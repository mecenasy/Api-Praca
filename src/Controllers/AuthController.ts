import { Response, Request } from 'express';
import Controller from './Controller';
import UserModel, { IUser } from '../Models/User';
import { generatePassword, validatePassword } from '../Auth/passwordUtils';
import { issueJWT } from '../Auth/jwt';

class AuthController extends Controller {
   constructor() {
      super('/login');

      this.initializeRoute();
   }

   public initializeRoute = () => {
      this.router
         .get('/logout', this.authenticate, this.logout)
         .get('/refreshtoken', this.authenticate, this.refreshToken)
         .post(this.routePath, this.login)
         .put(this.routePath, this.authenticate, this.updateUserPassword)
         .delete(this.routePath, this.authenticate, this.isAdmin, this.removeUser);
      return this;
   }

   private refreshToken = async (req: Request, res: Response) => {
      const user: IUser = req.user as IUser;
      try {
         const userFounded = await UserModel.findOne({ user: user.user });

         const { expiresIn, token } = issueJWT(userFounded);

         if (userFounded) {
            res.cookie('jwt', token, { maxAge: expiresIn });
            res.status(200)
               .send({
                  user: {
                     name: userFounded.user,
                     personId: userFounded.personId,
                     role: userFounded.role,
                     isDefaultPassword: userFounded.isDefaultPassword,
                  },
                  auth: {
                     expiresIn,
                     token,
                  },
               });
         } else {
            res.status(401).send({ loggedIn: false, message: 'you are not authorized' });
         }
      } catch (error) {
         return res.status(503).send({ message: 'something wrong' });
      }
   }

   private login = async ({ body, session }: Request, res: Response) => {
      if ((!body?.user && !body?.password)) {
         return res.status(400).send({ message: 'bud request' });
      }

      try {
         const userFounded = await UserModel.findOne({ user: body.user });

         if (userFounded) {
            const isValid = validatePassword(body.password, userFounded.hash, userFounded.salt);

            if (isValid) {
               const { expiresIn, token } = issueJWT(userFounded);

               res.status(200)
                  .send({
                     user: {
                        name: userFounded.user,
                        personId: userFounded.personId,
                        role: userFounded.role,
                        isDefaultPassword: userFounded.isDefaultPassword,
                     },
                     auth: {
                        expiresIn,
                        token,
                     },
                  });
            } else {
               res.status(401).send({ loggedIn: false, message: 'you are not authorized' });
            }
         } else {
            res.status(401).send({ loggedIn: false, message: 'you are not authorized' });
         }
      } catch (error) {
         res.status(503).send({ message: 'something wrong' });
      }
   }

   private logout = async (req: Request, res: Response) => {
      if (DEV) {
         res.status(200).send({
            loggedIn: false,
         });
      } else {
         req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.status(200).send({
               loggedIn: false,
            });
         });
      }
   }

   private removeUser = async (req: Request, res: Response) => {
      const user = req.body.user;

      const foundUser = await UserModel.findOne(user);

      if (!foundUser) {
         res.status(400).send({ message: 'user not exists' });
      } else {
         foundUser.active = false;

         await foundUser.save();

         res.send({ message: 'user removed' }).status(201);
      }
   }

   private updateUserPassword = async (req: Request, res: Response) => {
      const user: IUser = req.user as IUser;
      const newPassword = req.body.newPassword;

      const foundUser = await UserModel.findOne({ user: user.user });

      if (foundUser) {
         const { hash, salt } = generatePassword(newPassword);

         foundUser.hash = hash
         foundUser.salt = salt
         foundUser.isDefaultPassword = false;

         await foundUser.save();

         res.status(201).send({ message: 'password updated' });
      } else {
         res.status(400).send({ message: 'user not exists' });
      }
   }
}

export default AuthController