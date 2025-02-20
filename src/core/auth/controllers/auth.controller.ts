import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local.guard';
import { SignUpDto } from '../dtos/sign-up.dto';
import { ISignInRes, ISignUpRes, TAuthorizedReq } from '../types';
import { IsUserExistPipe } from '../pipes/is-user-exist.pipe';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(
    @Body(IsUserExistPipe) signUpDto: SignUpDto,
  ): Promise<ISignUpRes> {
    return await this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signIn(@Request() req: TAuthorizedReq): Promise<ISignInRes> {
    return this.authService.signIn(req.user);
  }
}
