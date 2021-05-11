import { Application, Request } from 'express';
import passport, { PassportStatic } from 'passport';
import { Strategy, VerifyCallback, ExtractJwt, StrategyOptions } from 'passport-jwt';
import fs from 'fs';
import path from 'path';
import UserModel from '../Models/User';

class AuthConfiguration {
   constructor(express: Application) {
      this.passport = passport
      this.express = express;
      this.config()
         .serialize()
         .deSerialize()
         .initializePassport();
   }

   private passport: PassportStatic;
   private express: Application;

   private serialize = (): AuthConfiguration => {
      this.passport.serializeUser((user: any, done: any) => {
         done(null, user.id);
      });

      return this;
   }

   private deSerialize = (): AuthConfiguration => {
      this.passport.deserializeUser(async (id: any, done: any) => {
         try {
            const user = await UserModel.findById(id)

            done(null, user);
         } catch (error) {
            done(error);
         }
      });

      return this;
   }

   private verifyFunction: VerifyCallback = async (payload, done) => {
      try {
         const user = await UserModel.findOne({ _id: payload.sub });
         if (!user) {
            done(null, false, { message: 'User not found' });
         } else {
            done(null, user);
         }
      } catch (error) {
         done(error);
      }
   }

   private tokenExtractor = (req: Request): string => {
      if (req && req.cookies) {
         return req.cookies['jwt'];
      }

      return '';
   }
   private config = (): AuthConfiguration => {
      const publicKey = fs.readFileSync(path.join(__dirname, 'rsa_pub.pem'));
      const option: StrategyOptions = {
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         secretOrKey: publicKey,
         algorithms: ['RS256'],
      }
      const strategy = new Strategy(option, this.verifyFunction);

      this.passport.use(strategy);

      return this;
   }

   private initializePassport = (): AuthConfiguration => {
      this.express.use(this.passport.initialize());
      this.express.use(this.passport.session());
      return this;
   }
}

export default AuthConfiguration;