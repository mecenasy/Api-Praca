import crypto from 'crypto';

export const validatePassword = (password: string, hash: string, salt: string): boolean => {
   const hashVerify = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex');

   return hashVerify === hash
}

export const generatePassword = (password: string): { salt: string; hash: string; } => {
   const salt = crypto
      .randomBytes(32)
      .toString('hex');

   const hash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex');

   return {
      salt,
      hash,
   }
}