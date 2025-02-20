import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { SignUpDto } from '../dtos/sign-up.dto';
import { ISignInRes, ISignUpRes, TAuthorizedUser } from '../types';
import { IUserHashOpts, UserHash } from '../../users/providers/users.providers';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,

    @UserHash() private readonly hash: IUserHashOpts,
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
    const user = await this.usersService.createOne(signUpDto);

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
    const user = await this.usersService.findOne(email);
    if (!user) {
      return null;
    }

    const isValid = await this.hash.verifyData(user.password, pass);
    if (!isValid) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
