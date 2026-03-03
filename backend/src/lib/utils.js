// import jwt from 'jsonwebtoken';
// import { ENV } from './env.js';

// export const generateToken = (userId, res) => {
//   const { JWT_SECRET, NODE_ENV } = ENV;
//   if (!JWT_SECRET) {
//     throw new Error('JWT_SECRET is not defined in environment variables');
//   }
//   const token = jwt.sign({ userId }, JWT_SECRET, {
//     expiresIn: '7d',
//   });
//   res.cookie('jwt', token, {
//     httpOnly: true,
//     secure: NODE_ENV === 'development' ? false : true,
//     sameSite: 'lax', // use "lax" instead of "strict" for REST Client
//     // sameSite: 'strict',
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   });
//   return token;
// };

import jwt from 'jsonwebtoken';
import { ENV } from './env.js';

export const generateToken = (userId, res) => {
  const { JWT_SECRET, NODE_ENV } = ENV;

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '7d',
  });

  const isProduction = NODE_ENV === 'production';

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: isProduction, // must be true in production
    sameSite: isProduction ? 'none' : 'lax', // critical fix
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
