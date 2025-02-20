import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UserHashProvider } from './providers/users.providers';

@Module({
  providers: [UsersService, UserHashProvider],
  exports: [UsersService],
})
export class UsersModule {}
