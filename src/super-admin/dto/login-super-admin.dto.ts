import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class LoginSuperAdminDto {
  @ApiProperty({
    type: 'string',
    example: 'superadmin@gmail.com',
    description: 'Super admin email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    example: 'SuperAdmin001!',
    description: 'Super admin password',
  })
  @IsStrongPassword()
  password: string;
}
