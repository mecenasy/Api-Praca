import { Request, Response } from "express";
import { interfaces, controller, httpGet, request, response } from "inversify-express-utils";
import { inject } from "inversify";
import { UserService, UserServiceType } from "../../Services/UserService";
import { AuthenticateType } from "../../Middlewares/Authenticate";
import { issueJWT } from "../../Auth/jwt";

@controller('/refreshtoken')
export class RefreshTokenController implements interfaces.Controller {
   constructor(@inject(UserServiceType) private userSer: UserService) { }

   @httpGet('/', AuthenticateType)
   async refreshToken(@request() { user }: Request, @response() res: Response) {
      try {
         await this.userSer.findUser(user.user);

         if (this.userSer.isExist()) {
            const userFounded = this.userSer.getUser();

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
         } else {
            res.status(401).send({ loggedIn: false, message: 'you are not authorized' });
         }
      } catch (error) {
         res.status(503).send({ message: 'something wrong', error });
      }
   }
}