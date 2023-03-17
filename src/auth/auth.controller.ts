import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @Post('/login')
  login(@Body() userDto: LoginUserDto) {
    return this.authService.login(userDto);
  }

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @Post('/registration')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }
}
