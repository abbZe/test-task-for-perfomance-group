import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/db.service';
import { User } from '@prisma/client';
import { SignUpDto } from '../../auth/dtos/sign-up.dto';
import { IUserHashOpts, UserHash } from '../providers/users.providers';
import { TFoundUser } from '../../auth/types';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    @UserHash() private readonly hash: IUserHashOpts,
  ) {}

  public createOne = async (signUpDto: SignUpDto): Promise<User> => {
    return this.prisma.user.create({
      data: {
        ...signUpDto,
        password: await this.hash.hashData(signUpDto.password),
      },
    });
  };

  public findOne = (email: string): Promise<TFoundUser | null> => {
    return this.prisma.user.findUnique({
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
  };
}
