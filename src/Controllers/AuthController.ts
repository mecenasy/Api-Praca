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
         .post('/refreshToken', this.authenticate, this.refreshToken)
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

         res.cookie('jwt', token, { maxAge: expiresIn })
            .status(200)
            .send({
               name: userFounded?.user,
               personId: userFounded?.personId,
               role: userFounded?.role,
               token,
               expiresIn
            });

      } catch (error) {
         return res.status(503).send({ message: 'something wrong' });
      }
   }

   private login = async ({ body }: Request, res: Response) => {
      if ((!body?.user && !body?.password)) {
         return res.status(400).send({ message: 'bud request' });
      }

      try {
         const user = await UserModel.findOne({ user: body.user });

         if (user) {
            const isValid = validatePassword(body.password, user.hash, user.salt);

            if (isValid) {
               const { expiresIn, token } = issueJWT(user);

               res.cookie('jwt', token, { maxAge: expiresIn })
                  .status(200)
                  .send({
                     name: user.user,
                     personId: user.personId,
                     role: user.role,
                     token,
                     expiresIn
                  });
            } else {
               res.status(401).send({ loggedIn: false, message: 'you are not authorized' })
            }
         } else {
            res.status(401).send({ loggedIn: false, message: 'you are not authorized' })
         }
      } catch (error) {
         res.status(503).send({ message: 'something wrong' });
      }
   }

   private logout = async (req: Request, res: Response) => {
      req.logout();
      res.clearCookie('connect.sid');
      req.session.destroy(() => {
         res.status(200).send({
            login: false,
         });
      });
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

         await foundUser.save();

         res.status(201).send({ message: 'password updated' });
      } else {
         res.status(400).send({ message: 'user not exists' });
      }
   }
}

export default AuthController