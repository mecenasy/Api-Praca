import { Router } from 'express';
import { IController } from '../Interface/IController';

abstract class Controller implements IController {
   constructor(routePath: string) {
      this.routePath = routePath;
      this.router = Router();
      this.baseHostUrl = `${BASE_HOST_PROTOCOL}://${BASE_HOST_URL}/${ASSETS_FOLDER}`;
   }

   public routePath: string;
   public router: Router;
   public baseHostUrl: string;
   public abstract initializeRoute = () => this;
}

export default Controller;
