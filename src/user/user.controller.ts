import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UserService } from './user.service';

@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
