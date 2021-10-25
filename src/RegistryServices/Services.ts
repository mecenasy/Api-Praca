import { Container, interfaces } from "inversify";
export interface IService {
   registry<T>(from: interfaces.ServiceIdentifier<T>, to: new (...args: never[]) => T): void;
   unRegistry<T>(from: interfaces.ServiceIdentifier<T>): void;
   get<T>(service: interfaces.ServiceIdentifier<T>): T;
   isExist(serviceType: any): boolean;
   getContainer(): Container;
}

export class Services implements IService {
   constructor() {
      this.container = new Container();
   }

   private static instance: Services;
   private container: Container;

   public registry<T>(from: interfaces.ServiceIdentifier<T>, to: new (...args: never[]) => T) {
      this.container.bind<T>(from).to(to).inSingletonScope();
   }

   public unRegistry<T>(from: interfaces.ServiceIdentifier<T>) {
      this.container.unbind(from)
   }

   public get<T>(service: interfaces.ServiceIdentifier<T>): T {
      return this.container.get(service);
   }

   public getContainer(): Container {
      return this.container;
   }

   public static getService = (): Services => {
      if (!Services.instance) {
         Services.instance = new Services();
      }

      return Services.instance;
   }
   public isExist(serviceType: any): boolean {
      return this.container.isBound(serviceType);
   }
}