import { Router } from 'express';
import { assetsUrl, baseHostUrl } from '../helpers/hostUrlHelpers';
import { IController } from '../Interface/IController';

abstract class Controller implements IController {
   constructor(routePath: string) {
      this.routePath = routePath;
      this.router = Router();
      this.baseHostUrl = baseHostUrl();
      this.assetsUrl = assetsUrl();
   }

   public routePath: string;
   public router: Router;
   public baseHostUrl: string;
   public assetsUrl: string;
   public abstract initializeRoute = () => this;
}

export default Controller;
