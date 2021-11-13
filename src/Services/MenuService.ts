import { injectable } from "inversify";
import MenuModel, { IMenu, MenuSide, IMenuModel, MenuDocument } from '../Models/Menu';
import { Aggregate } from 'mongoose';
import { imageUrl } from '../helpers/hostUrlHelpers';
import { Role } from "../Models/Role";

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
            role: 1,
            _id: 1,
         })
         .sort({ position: 1 })
         .exec();

      return menu.map(({ image, ...rest }): IMenu => {

         return { ...rest, image: imageUrl(image) };
      });
   }

   public async getMenuByRole(role: Role): Promise<IMenu[]> {
      const menu: IMenu[] = await new Aggregate<IMenu[]>()
         .model(this.menuModel)
         .match({ role: { '$in': [role] } })
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

   public async addMenuItem(item: IMenu): Promise<MenuDocument | null> {
      const { name, link, image, position, shortName, menuSide, hidden, role } = item;

      const existingItem = await this.menuModel.findOne({ name });

      if (existingItem) {
         return null;
      }

      const newMenu = new this.menuModel({
         name,
         position,
         shortName,
         menuSide,
         link,
         image,
         hidden,
         role,
      });

      return await newMenu.save()

   }

   public async updateMenuItem(item: Partial<IMenu> & { id: string }): Promise<MenuDocument | null> {
      const { id, ...menu } = item;

      try {
         await this.menuModel.findByIdAndUpdate(id, menu);
         return await this.menuModel.findById(id);
      } catch (error) {
         return null;
      }
   }

   public async removeMenuItem(id: string): Promise<boolean> {
      const existingItem = await this.menuModel.findByIdAndRemove(id);

      return !existingItem;
   }
}