import { Response, Request } from 'express';
import MenuModel, { IMenu, MenuSide } from '../Models/Menu';
import Controller from './Controller';


export class MenuController extends Controller {
   constructor() {
      super('/menu');

      this.initializeRoute();
   }

   public initializeRoute = () => {
      this.router
         .get(this.routePath, this.getMenu)
         .post(this.routePath, this.addMenuItem);

      return this;
   }

   private getMenu = async (req: Request, res: Response) => {
      const menu = await MenuModel.find({})
         .sort('position');

      const menuItems = menu.map((item): IMenu => {
         const { __v, _id, ...menuItem } = item.toJSON();

         return ({
            ...menuItem,
            image: `${this.assetsUrl}/${menuItem.image}`
         });
      });

      res.send(menuItems)
         .status(200);
   }

   private addMenuItem = async (req: Request, res: Response) => {
      const { name, link, image, position, shortName, menuSide, hidden }: IMenu = req.body;

      if (name && link && image && (menuSide === MenuSide.Left || menuSide === MenuSide.Right)) {
         const existingItem = await MenuModel.findOne({ name });

         if (existingItem) {
            res.send({ message: 'menu item exist' })
               .status(400);
            return;
         }

         try {
            await MenuModel.insertMany({
               name,
               position,
               shortName,
               menuSide,
               link,
               image,
               hidden
            });

            res.send({ message: 'menu item added' })
               .status(200);
            return;

         } catch (error) {
            res.send(error);
         }
      }

      res.send({ message: 'data of menu item not complice' })
         .status(400);
   }
}

export default MenuController;
