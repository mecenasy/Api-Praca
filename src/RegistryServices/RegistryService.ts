import { Container } from 'inversify';
import { Db } from '../Db/Db';
import MongoDBNew from '../Db/MongoDb';
import { IService, Services } from './Services';
//Middlewares
import { Admin, AdminType } from '../Middlewares/Admin';
import { Authenticate, AuthenticateType } from '../Middlewares/Authenticate';
import { User, UserType } from '../Middlewares/User';
//Services
import { UserService, UserServiceType } from '../Services/UserService';
import { MenuService, MenuServiceType } from '../Services/MenuService';
import { PersonService, PersonServiceType } from '../Services/PersonService';
import { AddressService, AddressServiceType } from '../Services/AddressService';
//Controlers
import '../Controllers/Auth/LoginController';
import '../Controllers/Auth/LogoutController';
import '../Controllers/Auth/RefreshTokenController';
import '../Controllers/MenuController';
import '../Controllers/PersonController';

export class RegistryService {
   private service: IService;

   constructor() {
      this.service = Services.getService();

      this.service.registry(Db, MongoDBNew);
      this.service.registry(UserServiceType, UserService);
      this.service.registry(MenuServiceType, MenuService);
      this.service.registry(PersonServiceType, PersonService);
      this.service.registry(AddressServiceType, AddressService);
      this.service.registry(AuthenticateType, Authenticate);
      this.service.registry(AdminType, Admin);
      this.service.registry(UserType, User);
   }

   public getService<T>(serviceType: any): T {
      if (this.service.isExist(serviceType)) {
         return this.service.get<T>(serviceType);
      }
      throw new Error('servise not exits');
   }

   public getContainer(): Container {
      return this.service.getContainer();
   }
}
