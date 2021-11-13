import { Response } from 'express';
import { interfaces, controller, response, httpGet } from "inversify-express-utils";
import { inject } from "inversify";
import { AuthenticateType } from '../Middlewares/Authenticate';
import { AdminType } from '../Middlewares/Admin';
import { RoleService, RoleServiceType } from '../Services/RoleService';

@controller('/role')
export class RoleController implements interfaces.Controller {
   constructor(@inject(RoleServiceType) private roleSer: RoleService) { }

   @httpGet('/', AuthenticateType, AdminType)
   public async getRole(@response() res: Response) {
      try {
         const result = await this.roleSer.getRole();

         res.status(200).send(result)
      } catch (error) {
         res.status(500).send({ message: 'something wrong' })
      }

   }
}

export default RoleController;
