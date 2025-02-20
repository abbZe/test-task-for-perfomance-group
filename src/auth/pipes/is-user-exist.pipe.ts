import {
  Injectable,
  PipeTransform,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { SignUpDto } from '../dtos/sign-up.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class IsUserExistPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}

  async transform(value: SignUpDto) {
    const signUpDtoInstance = plainToInstance(SignUpDto, value);
    const errors = await validate(signUpDtoInstance);

    if (errors.length > 0) {
      throw new BadRequestException(
        errors.map((error) => error.constraints).join(', '),
      );
    }

    const userExists = await this.usersService.findOne(value.email);

    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }

    return value;
  }
}
