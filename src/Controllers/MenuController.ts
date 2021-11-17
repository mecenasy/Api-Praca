import { Response, Request } from 'express';
import { interfaces, controller, httpPost, request, response, httpGet, httpPut, httpDelete } from "inversify-express-utils";
import { inject } from "inversify";
import { MenuService, MenuServiceType } from '../Services/MenuService';
import { IMenu } from '../Models/Menu';
import { AuthenticateType } from '../Middlewares/Authenticate';
import { AdminType } from '../Middlewares/Admin';
import { Role } from '../Models/Role';
import fileUpload from 'express-fileupload';
import fs from 'fs/promises';
import path from 'path';

@controller('/menu')
export class MenuController implements interfaces.Controller {
   constructor(@inject(MenuServiceType) private menuSer: MenuService) { }

   @httpGet('/', AuthenticateType, AdminType)
   public async getMenu(@response() res: Response) {
      try {
         const menu: IMenu[] = await this.menuSer.getMenu()

         res.send(menu)
            .status(200);
      } catch (error) {
         res.send(error);
      }
   }

   @httpGet('/:role')
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
   public async addMenuItem(@request() req: Request<any, any, IMenu & { _id: string }>, @response() res: Response) {
      if (req.body._id) {
         await this.updateMenu(req, res);
      } else {
         await this.addMenu(req, res);
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

   @httpDelete('/:id', AuthenticateType, AdminType)
   public async deleteMenuItem(@request() { params }: Request, @response() res: Response) {
      const isUpdated = await this.menuSer.removeMenuItem(params.id);

      if (isUpdated) {
         res.send({ message: 'menu item deleted' })
            .status(200);
      } else {
         res.send({ message: 'menu item not exist' })
            .status(400);
      }
   }
   private async addMenu({ body, files }: Request<any, any, IMenu & { _id: string }>, @response() res: Response) {
      console.log("🚀 ~ file: MenuController.ts ~ line 76 ~ MenuController ~ addMenu ~  body, files ", body, files)
      if (!files) {
         res.status(400).send({ message: 'you must uploaded image' })
      } else {
         try {
            body.image = this.getImageName(files);
            if (this.menuSer.checkMenuItem(body)) {
               body.role = JSON.parse(body.role.toString());
               const menuItem = await this.menuSer.addMenuItem(body);
               if (menuItem) {
                  const pathFile = path.join(__dirname, `../${ASSETS_FOLDER}`, this.getImageName(files));
                  try {
                     await fs.writeFile(pathFile, this.getFileData(files).toString());
                  } catch (error) {
                     console.log(error); res.send(error)
                  }
                  res.status(200).send(menuItem);
               } else {
                  res.send({ message: 'menu item not exist' })
                     .status(400);
               }
            }

         } catch (error) { res.send(error) }
      }
   }

   private async updateMenu({ body, files }: Request<any, any, IMenu & { _id: string }>, @response() res: Response) {
      try {
         if (files) {
            body.image = this.getImageName(files);
         }
         body.role = JSON.parse(body.role.toString());
         const menuItem = await this.menuSer.updateMenuItem(body);
         if (menuItem) {
            if (files) {
               const pathFile = this.pathFile(files);

               try {
                  await fs.writeFile(pathFile, this.getFileData(files).toString());
               } catch (error) {
                  res.send(error)
               }
            }
            res.status(200).send(menuItem);
         }
      } catch (error) {
         res.send(error)
      }
   }

   private getFileData(files: fileUpload.FileArray): string | NodeJS.ArrayBufferView {
      return Array.isArray(files.image) ? files.image[0].data : files.image.data;
   }

   private pathFile(files: fileUpload.FileArray) {
      return path.join(__dirname, `../${ASSETS_FOLDER}`, this.getImageName(files));
   }

   private getImageName(files: fileUpload.FileArray): string {
      return Array.isArray(files.image) ? files.image[0].name : files.image.name;
   }
}

export default MenuController;
