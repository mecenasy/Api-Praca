import { RequestHandler, Router } from 'express';
import passport from 'passport';
import { isAdmin } from '../Auth/authMiddleware';
import { assetsUrl, baseHostUrl } from '../helpers/hostUrlHelpers';
import { IController } from '../Interface/IController';

abstract class Controller implements IController {
   constructor(routePath: string) {
      this.routePath = routePath;
      this.router = Router();
      this.baseHostUrl = baseHostUrl();
      this.assetsUrl = assetsUrl();
      this.isAdmin = isAdmin;
      this.authenticate = passport.authenticate('jwt', { session: false });
   }

   public routePath: string;
   public router: Router;
   public baseHostUrl: string;
   public assetsUrl: string;
   public abstract initializeRoute = () => this;
   public isAdmin: RequestHandler;
   public authenticate: RequestHandler;
}

export default Controller;
