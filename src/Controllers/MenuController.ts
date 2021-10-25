import { Response, Request } from 'express';
import { interfaces, controller, httpPost, request, response, httpGet } from "inversify-express-utils";
import { inject } from "inversify";
import { MenuService, MenuServiceType } from '../Services/MenuService';
import { IMenu } from '../Models/Menu';
import { AuthenticateType } from '../Middlewares/Authenticate';

@controller('/menu')
export class MenuController implements interfaces.Controller {
   constructor(@inject(MenuServiceType) private menuSer: MenuService) { }

   @httpGet('/', AuthenticateType)
   public async getMenu(@response() res: Response) {
      const menu: IMenu[] = await this.menuSer.getMenu()

      res.send(menu)
         .status(200);
   }

   @httpPost('/', AuthenticateType)
   public async addMenuItem(@request() { body }: Request, @response() res: Response) {
      if (this.menuSer.checkMenuItem(body)) {
         try {
            const isAdded = await this.menuSer.addMenuItem(body);

            if (isAdded) {
               res.send({ message: 'menu item added' })
                  .status(200);
            } else {
               res.send({ message: 'menu item exist' })
                  .status(400);
            }

         } catch (error) {
            res.send(error);
         }
      }

      res.send({ message: 'data of menu item not complice' })
         .status(400);
   }
}

export default MenuController;
