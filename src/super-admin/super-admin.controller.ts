import {
  Controller,
  Body,
  Post,
  Res,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { CreateSuperAdminDto } from './dto/create-superAdmin.dto';
import { LoginSuperAdminDto } from './dto/login-super-admin.dto';
import { Response } from 'express';
import { CookieGetter } from 'src/decorators/cookieGetter';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateSelfInfoDto } from './dto/update-super-admin.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { JwtGuard } from 'src/guards/jwt-auth.guard';
import { IsSuperAdminGuard } from 'src/guards/is-super-admin.guard';
import { SuperAdmin } from './models/super-admin.model';

@ApiTags('super-admin')
@Controller('super-admin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Post('/create')
  createSuperAdmin(@Body() createSuperAdminDto: CreateSuperAdminDto) {
    return this.superAdminService.createSuperAdmin(createSuperAdminDto);
  }

  @ApiOperation({ summary: 'login super admin' })
  @ApiResponse({
    status: 200,
    type: SuperAdmin,
    description: 'Super admin tizmiga muvaffaqiyatli kirdi',
  })
  @HttpCode(HttpStatus.OK)
  @Post('/login-otabek')
  login(
    @Body() loginSuperAdminDto: LoginSuperAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.superAdminService.login(loginSuperAdminDto, res);
  }

  @ApiOperation({ summary: 'logout super admin' })
  @ApiResponse({
    status: 200,
    description: 'Super admin tizimdan muvaffaqiyatli chiqdi',
  })
  @HttpCode(HttpStatus.OK)
  @Post('/logout-otabek')
  logout(
    @CookieGetter('refresh_token_super_admin') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.superAdminService.logout(refresh_token, res);
  }

  @ApiOperation({ summary: 'refresh token super admin' })
  @ApiResponse({
    status: 200,
    description: 'Super adminning refresh tokeni muvaffaqiyatli yangilandi',
  })
  @UseGuards(IsSuperAdminGuard)
  @UseGuards(JwtGuard)
  @Post('/refresh-token-otabek/:id')
  refreshToken(
    @Param('id') id: number,
    @CookieGetter('refresh_token_super_admin') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.superAdminService.refreshToken(id, refresh_token, res);
  }

  @ApiOperation({ summary: 'edit profile super admin' })
  @ApiResponse({
    status: 200,
    type: SuperAdmin,
    description: "Super admin ma'lumotlarini muvaffaqiyatli o'zgartirdi",
  })
  @UseGuards(IsSuperAdminGuard)
  @UseGuards(JwtGuard)
  @Patch('/update-otabek/:id')
  updateInfo(
    @Param('id') id: number,
    @Body() updateSelfInfoDto: UpdateSelfInfoDto,
  ) {
    return this.superAdminService.updateInfo(id, updateSelfInfoDto);
  }

  @ApiOperation({ summary: 'new password' })
  @ApiResponse({
    status: 200,
    type: SuperAdmin,
    description: "Super admin parolini muvaffaqiyatili o'zgartirdi",
  })
  @UseGuards(IsSuperAdminGuard)
  @UseGuards(JwtGuard)
  @Patch('/new-password-otabek/:id')
  newPassword(@Param('id') id: number, @Body() newPasswordDto: NewPasswordDto) {
    return this.superAdminService.newPassword(id, newPasswordDto);
  }
}
