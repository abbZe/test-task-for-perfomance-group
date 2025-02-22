import { Inject, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash, verify } from 'argon2';

export interface IAuthCfg {
  jwtSecret: string;
}

export const AuthCfg = () => Inject(AuthCfgToken);

export const AuthCfgToken = Symbol('AUTH_CFG_TOKEN');

export const AuthCfgProvider: Provider = {
  provide: AuthCfgToken,
  inject: [ConfigService],
  useFactory: (cs: ConfigService): IAuthCfg => ({
    jwtSecret: cs.getOrThrow('AUTH_JWT_SECRET'),
  }),
};

export interface IArgonHashOpts {
  hashData: (data: string) => Promise<string>;
  verifyData: (digest: string, data: string) => Promise<boolean>;
}

export const ArgonHash = () => Inject(ArgonHashToken);

const ArgonHashToken = Symbol('ARGON_HASH_TOKEN');

export const ArgonHashProvider: Provider<IArgonHashOpts> = {
  provide: ArgonHashToken,
  useFactory: async () => {
    return {
      hashData: async (data: string) => await hash(data),
      verifyData: async (digest: string, data: string) =>
        await verify(digest, data),
    };
  },
};
