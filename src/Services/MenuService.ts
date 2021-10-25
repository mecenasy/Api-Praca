import { injectable } from "inversify";
import MenuModel, { IMenu, MenuSide, IMenuModel } from '../Models/Menu';
import { Aggregate } from 'mongoose';
import { imageUrl } from '../helpers/hostUrlHelpers';

export const MenuServiceType = Symbol.for('MenuService');

@injectable()
export class MenuService {
   constructor() {
      this.menuModel = MenuModel;
   }
   private menuModel: IMenuModel;

   public async getMenu(): Promise<IMenu[]> {
      const menu: IMenu[] = await new Aggregate<IMenu[]>()
         .model(this.menuModel)
         .project({
            name: 1,
            shortName: 1,
            link: 1,
            position: 1,
            menuSide: 1,
            image: 1,
            hidden: 1,
            _id: 0
         })
         .sort({ position: 1 })
         .exec();

      return menu.map(({ image, ...rest }): IMenu => {

         return { ...rest, image: imageUrl(image) };
      });
   }

   public checkMenuItem(item: IMenu): boolean {
      const { name, link, image, menuSide }: IMenu = item;

      return Boolean(
         name
         && link
         && image
         && (menuSide === MenuSide.Left || menuSide === MenuSide.Right)
      )
   }

   public async addMenuItem(item: IMenu): Promise<boolean> {
      const { name, link, image, position, shortName, menuSide, hidden } = item;

      const existingItem = await this.menuModel.findOne({ name });
      if (existingItem) {

         return false;
      }
      await this.menuModel.insertMany({
         name,
         position,
         shortName,
         menuSide,
         link,
         image,
         hidden
      });

      return true;
   }
}