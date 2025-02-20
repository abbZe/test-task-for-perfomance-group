import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const jwtAsyncConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (cs: ConfigService) => {
    return {
      global: true,
      secret: cs.getOrThrow('AUTH_JWT_SECRET'),
      signOptions: { expiresIn: '24h' },
    };
  },
};
