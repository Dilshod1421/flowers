import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UpdateSelfInfoDto {
  @ApiProperty({
    type: 'string',
    example: 'superadmin2@gmail.com',
    description: "Super admin emailini o'zgartirishi mumkin",
  })
  @IsEmail()
  email?: string;

  @ApiProperty({
    type: 'string',
    example: 'otabek001',
    description: "Super admin usernameini o'zgartirishi mumkin",
  })
  username?: string;

  @ApiProperty({
    type: 'string',
    example: 'avatar.jpg',
    description: "Super admin rasmini o'zgartirishi mumkin",
  })
  photo?: string;

  @ApiProperty({
    type: 'string',
    example: '+998901234567',
    description: "Super admin telefon raqamini o'zgartirishi mumkin",
  })
  phone_number?: string;
}
