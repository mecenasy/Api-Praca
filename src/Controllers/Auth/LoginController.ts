import { Request, Response } from "express";
import { interfaces, controller, httpPost, httpDelete, request, response, httpPut } from "inversify-express-utils";
import { inject } from "inversify";
import { UserService, UserServiceType } from "../../Services/UserService";
import { AuthenticateType } from "../../Middlewares/Authenticate";
import { validatePassword } from "../../Auth/passwordUtils";
import { issueJWT } from "../../Auth/jwt";

@controller('/login')
export class LoginController implements interfaces.Controller {
   constructor(@inject(UserServiceType) private userSer: UserService) { }

   @httpPost('/')
   async loginUser(@request() req: Request, @response() res: Response) {

      if (!req.body?.user || !req.body?.password) {
         return res.status(400).send({ message: 'bud request' });
      }

      try {
         await this.userSer.findUser(req.body.user);
         if (this.userSer.isExist()) {
            const userFounded = this.userSer.getUser();

            const isValid = validatePassword(req.body.password, userFounded.hash, userFounded.salt);

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
         res.status(503).send({ message: 'something wrong', error });
      }
   }

   @httpPut('/', AuthenticateType)
   async updatePassword(@request() { body }: Request, @response() res: Response) {
      if (!body?.user || !body?.password) {
         return res.status(400).send({ message: 'bud request' });
      }

      try {
         await this.userSer.findUser(body.user);

         this.userSer.updatePassword(body.newPassword)

         res.status(201).send({ message: 'password updated' });
      } catch (error) {
         res.status(400).send({ message: 'user not exists' });
      }
   }

   @httpDelete('/', AuthenticateType)
   async deleteUser(@request() { body }: Request, @response() res: Response) {
      if (!body?.user || !body?.password) {
         return res.status(400).send({ message: 'bud request' });
      }

      try {
         await this.userSer.deleteUser(body.user)
      } catch (error) {
         res.status(503).send({ message: 'something wrong', error });
      }
   }
}