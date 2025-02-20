import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthCfg, IAuthCfg } from '../providers/auth.providers';
import { IUserJWTPayload } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@AuthCfg() private readonly authCfg: IAuthCfg) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authCfg.jwtSecret,
    });
  }

  async validate(payload: IUserJWTPayload) {
    return payload;
  }
}
