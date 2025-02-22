import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TAuthorizedUser } from '../types';
import * as R from 'ramda';
import { PrismaService } from '../../db/db.service';
import { ArgonHash, IArgonHashOpts } from '../providers/auth.providers';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,

    @ArgonHash() private readonly argonHash: IArgonHashOpts,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<TAuthorizedUser> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isValid = await this.argonHash.verifyData(user.password, password);

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return R.omit(['password'], user);
  }
}
