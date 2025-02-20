import { Global, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthCfgProvider } from './providers/auth.providers';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtAsyncCfg } from './cfg';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { IsUserExistPipe } from './pipes/is-user-exist.pipe';
import { UserHashProvider } from '../users/providers/users.providers';

@Global()
@Module({
  imports: [UsersModule, JwtModule.registerAsync(jwtAsyncCfg)],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthCfgProvider,
    UserHashProvider,
    LocalStrategy,
    JwtStrategy,
    IsUserExistPipe,
  ],
})
export class AuthModule {}
