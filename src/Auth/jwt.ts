import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

type IssueJWT = (user: any) => { token: string, expiresIn: number };

export const issueJWT: IssueJWT = (user) => {
   const payload = {
      sub: user._id,
      iat: Date.now(),
   };

   const expiresIn = 3600;

   const privKey = fs.readFileSync(path.join(__dirname, 'rsa_priv.pem'),);
   const token = jwt.sign(payload, privKey, { algorithm: 'RS256', expiresIn });

   return {
      token,
      expiresIn,
   }
}