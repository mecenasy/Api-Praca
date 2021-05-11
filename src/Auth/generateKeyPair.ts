import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export const generateKeyPair = () => {
   const keyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
         type: 'pkcs1',
         format: 'pem',
      },
      privateKeyEncoding: {
         type: 'pkcs1',
         format: 'pem',
      },
   });

   const keyPath = path.resolve(__dirname, '../build');
   const pubKeyPath = path.join(keyPath, 'rsa_pub.pem');

   if (!fs.existsSync(pubKeyPath)) {
      fs.writeFileSync(pubKeyPath, keyPair.publicKey);
   }

   const privKeyPath = path.join(keyPath, 'rsa_priv.pem');

   if (!fs.existsSync(privKeyPath)) {
      fs.writeFileSync(privKeyPath, keyPair.privateKey);
   }
}

