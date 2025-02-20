import { User } from '@prisma/client';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export type TFoundUser = Pick<
  User,
  'id' | 'name' | 'email' | 'password' | 'role' | 'createdAt'
>;

export type TAuthorizedUser = Omit<TFoundUser, 'password'>;

export type TAuthorizedReq = Request & { user: TAuthorizedUser };

export interface ISignUpRes {
  access_token: string;
}

export type ISignInRes = ISignUpRes;

export interface IUserJWTPayload extends JwtPayload {
  sub: string;
  email: string;
  role: string;
  createdAt: string;
  iat: number;
  exp: number;
}
