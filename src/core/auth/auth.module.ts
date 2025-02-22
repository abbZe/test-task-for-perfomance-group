import { Global, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { ArgonHashProvider, AuthCfgProvider } from './providers/auth.providers';
import { JwtModule } from '@nestjs/jwt';
import { jwtAsyncCfg } from './cfg';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { IsUserExistPipe } from './pipes/is-user-exist.pipe';

@Global()
@Module({
  imports: [JwtModule.registerAsync(jwtAsyncCfg)],
  controllers: [AuthController],
  providers: [
    AuthCfgProvider,
    ArgonHashProvider,
    LocalStrategy,
    JwtStrategy,
    IsUserExistPipe,
  ],
})
export class AuthModule {}
