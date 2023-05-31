import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from 'class-validator';

export class NewPasswordDto {
  @ApiProperty({
    type: 'string',
    example: 'Otabek001Alisherov!',
    description: 'old password',
  })
  @IsStrongPassword()
  old_password: string;

  @ApiProperty({
    type: 'string',
    example: 'Alisherov111!',
    description: 'new password',
  })
  @IsStrongPassword()
  new_password: string;
}
