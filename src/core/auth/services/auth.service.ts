import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '../dtos/sign-up.dto';
import { ISignInRes, ISignUpRes, TAuthorizedUser } from '../types';
import { PrismaService } from '../../db/db.service';
import { ArgonHash, IArgonHashOpts } from '../providers/auth.providers';
import * as R from 'ramda';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,

    @ArgonHash() private readonly argonHash: IArgonHashOpts,
  ) {}

  async signIn(user: TAuthorizedUser): Promise<ISignInRes> {
    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      }),
    };
  }

  async signUp(signUpDto: SignUpDto): Promise<ISignUpRes> {
    const user = await this.prisma.user.create({
      data: {
        ...signUpDto,
        password: await this.argonHash.hashData(signUpDto.password),
      },
    });

    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      }),
    };
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<TAuthorizedUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
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
      return null;
    }

    const isValid = await this.argonHash.verifyData(user.password, pass);
    if (!isValid) {
      return null;
    }

    return R.omit(['password'], user);
  }
}
