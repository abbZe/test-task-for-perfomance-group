import { Inject, Provider } from '@nestjs/common';
import { hash, verify } from 'argon2';

export interface IUserHashOpts {
  hashData: (data: string) => Promise<string>;
  verifyData: (digest: string, data: string) => Promise<boolean>;
}

export const UserHash = () => Inject(UserHashToken);
const UserHashToken = Symbol('USER_HASH_TOKEN');
export const UserHashProvider: Provider<IUserHashOpts> = {
  provide: UserHashToken,
  useFactory: async () => {
    return {
      hashData: async (data: string) => await hash(data),
      verifyData: async (digest: string, data: string) =>
        await verify(digest, data),
    };
  },
};
