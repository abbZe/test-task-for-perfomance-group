import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local.guard';
import { SignUpDto } from '../dtos/sign-up.dto';
import { ISignInRes, ISignUpRes, TAuthorizedReq } from '../types';
import { IsUserExistPipe } from '../pipes/is-user-exist.pipe';
import { PrismaService } from '../../db/db.service';
import { ArgonHash, IArgonHashOpts } from '../providers/auth.providers';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class AuthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,

    @ArgonHash() private readonly argonHash: IArgonHashOpts,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(
    @Body(IsUserExistPipe) signUpDto: SignUpDto,
  ): Promise<ISignUpRes> {
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

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signIn(@Request() req: TAuthorizedReq): ISignInRes {
    return {
      access_token: this.jwtService.sign({
        sub: req.user.id,
        email: req.user.email,
        role: req.user.role,
        createdAt: req.user.createdAt,
      }),
    };
  }
}
