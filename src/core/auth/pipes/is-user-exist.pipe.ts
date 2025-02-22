import {
  Injectable,
  PipeTransform,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { SignUpDto } from '../dtos/sign-up.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PrismaService } from '../../db/db.service';

@Injectable()
export class IsUserExistPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  async transform(value: SignUpDto) {
    const signUpDtoInstance = plainToInstance(SignUpDto, value);
    const errors = await validate(signUpDtoInstance);

    if (errors.length > 0) {
      throw new BadRequestException(
        errors.map((error) => error.constraints).join(', '),
      );
    }

    const userExists = await this.prisma.user.findUnique({
      where: {
        email: signUpDtoInstance.email,
      },
    });

    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }

    return value;
  }
}
