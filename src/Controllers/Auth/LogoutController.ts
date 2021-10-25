import { Request, Response } from "express";
import { interfaces, controller, httpGet, request, response } from "inversify-express-utils";
import { AuthenticateType } from "../../Middlewares/Authenticate";

@controller('/logout')
export class LogoutController implements interfaces.Controller {
   @httpGet('/', AuthenticateType)
   async refreshToken(@request() { session }: Request, @response() res: Response) {
      if (DEV) {
         res.status(200).send({
            loggedIn: false,
         });
      } else {
         session.destroy(() => {
            res.clearCookie('connect.sid');
            res.status(200).send({
               loggedIn: false,
            });
         });
      }
   }
}