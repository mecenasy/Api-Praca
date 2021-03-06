declare namespace NodeJS {
   interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT: number;
      MONGO_DB_SERVER: string;
      MONGO_DB_USER: string;
      MONGO_DB_PASSWORD: string;
      MONGO_DB_DATA: string;
      CORS_ORIGIN_PATH: string;
      ASSETS_FOLDER: string;
      BASE_HOST_URL: string;
      BASE_HOST_PROTOCOL: string;
      SESSION_SECRET: string;
   }
}
interface IUser {
   user: string;
   hash: string;
   salt: string;
   role: Role;
   personId: any;
   active?: boolean;
   isDefaultPassword?: boolean;
}

declare const DEV: boolean;
declare const PORT: number;
declare const MONGO_DB_SERVER: string;
declare const MONGO_DB_USER: string;
declare const MONGO_DB_PASSWORD: string;
declare const MONGO_DB_DATA: string;
declare const CORS_ORIGIN_PATH: string;
declare const ASSETS_FOLDER: string;
declare const BASE_HOST_URL: string;
declare const BASE_HOST_PROTOCOL: string;
declare const SESSION_SECRET: string;

declare module 'crypto' {
   function generateKeyPairSync(
      type: 'rsa',
      options: RSAKeyPairOptions<'pem', 'pem'>,
   ): KeyPairSyncResult<string, string>;
}

declare namespace Express {
   export interface Request {
      user: IUser;
      isAuthenticated(): boolean
   }
   export interface Response {
      user: IUser;
   }
}