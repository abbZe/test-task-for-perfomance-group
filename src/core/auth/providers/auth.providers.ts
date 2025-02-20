import { Inject, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
