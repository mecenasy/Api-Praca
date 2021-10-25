
import { Store } from 'express-session';
import { injectable } from "inversify";

@injectable()
export abstract class Db<T> {
   public abstract getStore(): Store
   protected abstract connectToDataBase(): Promise<T>;
}