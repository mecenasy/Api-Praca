import { Response, Request } from 'express';
import { interfaces, controller, httpPost, request, response, httpGet, httpPut, httpDelete } from "inversify-express-utils";
import { inject } from "inversify";
import { MenuService, MenuServiceType } from '../Services/MenuService';
import { IMenu } from '../Models/Menu';
import { AuthenticateType } from '../Middlewares/Authenticate';
import { AdminType } from '../Middlewares/Admin';
import { Role } from '../Models/Role';


@controller('/menu')
export class MenuController implements interfaces.Controller {
   constructor(@inject(MenuServiceType) private menuSer: MenuService) { }

   @httpGet('/', AuthenticateType)
   public async getMenu(@response() res: Response) {
      try {
         const menu: IMenu[] = await this.menuSer.getMenu()

         res.send(menu)
            .status(200);
      } catch (error) {
         res.send(error);
      }
   }

   @httpGet('/:role', AuthenticateType)
   public async getMenuByRole(@request() { params }: Request, @response() res: Response) {
      try {
         const menu = await this.menuSer.getMenuByRole(params.role as Role) // FIXME

         res.send(menu)
            .status(200);
      } catch (error) {
         res.send(error);
      }
   }

   @httpPost('/', AuthenticateType, AdminType)
   public async addMenuItem(@request() { body }: Request, @response() res: Response) {
      if (this.menuSer.checkMenuItem(body)) {
         try {
            const addedItem = await this.menuSer.addMenuItem(body);

            if (addedItem) {
               res.send(addedItem)
                  .status(200);
            } else {
               res.send({ message: 'menu item exist' })
                  .status(400);
            }
         } catch (error) {
            res.send(error);
         }
      } else {
         res.send({ message: 'data of menu item not complice' })
            .status(400);
      }
   }

   @httpPut('/', AuthenticateType, AdminType)
   public async updateMenuItem(@request() req: Request, @response() res: Response) {
      const updatedMenu = await this.menuSer.updateMenuItem(req.body);

      if (updatedMenu) {
         res.send(updatedMenu)
            .status(200);
      } else {
         res.send({ message: 'menu item not exist' })
            .status(400);
      }
   }

   @httpDelete('/', AuthenticateType, AdminType)
   public async deleteMenuItem(@request() req: Request, @response() res: Response) {
      const isUpdated = await this.menuSer.removeMenuItem(req.body.id);

      if (isUpdated) {
         res.send({ message: 'menu item deleted' })
            .status(200);
      } else {
         res.send({ message: 'menu item not exist' })
            .status(400);
      }
   }
}

export default MenuController;
