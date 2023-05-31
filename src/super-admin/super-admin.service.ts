import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SuperAdmin } from './models/super-admin.model';
import { LoginSuperAdminDto } from './dto/login-super-admin.dto';
import { Response } from 'express';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateSuperAdminDto } from './dto/create-superAdmin.dto';
import { UpdateSelfInfoDto } from './dto/update-super-admin.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { generateToken, writeToCookie } from 'src/tokens/tokenFunctions';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectModel(SuperAdmin) private superAdminRepository: typeof SuperAdmin,
    private readonly jwtService: JwtService,
  ) {}

  async createSuperAdmin(createSuperAdminDto: CreateSuperAdminDto) {
    const email = createSuperAdminDto.email;
    const salt = 10;
    const password = createSuperAdminDto.password;
    const hashed_password = await hash(password, salt);
    await this.superAdminRepository.create({ email, hashed_password });
  }

  async login(loginSuperAdminDto: LoginSuperAdminDto, res: Response) {
    const { email, password } = loginSuperAdminDto;
    const super_admin = await this.superAdminRepository.findOne({
      where: { email },
    });
    if (!super_admin) {
      throw new BadRequestException('Email xato!');
    }
    const is_match_password = await compare(
      password,
      super_admin.hashed_password,
    );
    if (!is_match_password) {
      throw new BadRequestException('Parol xato!');
    }
    const jwt_payload = {
      id: super_admin.id,
      is_super_admin: super_admin.is_super_admin,
    };
    const token = await generateToken(jwt_payload, this.jwtService);
    const hashed_refresh_token = await hash(token.refresh_token, 7);
    const _super_admin = await this.superAdminRepository.update(
      { hashed_refresh_token, is_super_admin: true },
      { where: { id: super_admin.id }, returning: true },
    );
    await writeToCookie(token.refresh_token, 'super_admin', res);
    return {
      token: token.access_token,
      super_admin: _super_admin[1][0],
    };
  }

  async logout(refresh_token: string, res: Response) {
    let verified: any;
    try {
      verified = await this.jwtService.verify(refresh_token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });
    } catch (error) {
      throw new ForbiddenException({
        message: 'Siz tizimdan chiqish huquqiga ega emassiz!',
        error,
      });
    }
    const super_admin = await this.superAdminRepository.update(
      { hashed_refresh_token: null, is_super_admin: false },
      { where: { id: verified.id }, returning: true },
    );
    res.clearCookie('refresh_token_super_admin');
    return {
      message: 'Super admin tizimdan chiqdi',
      super_admin: super_admin[1][0],
    };
  }

  async refreshToken(id: number, refresh_token: string, res: Response) {
    const decoded_token = this.jwtService.decode(refresh_token);
    if (id != decoded_token['id']) {
      throw new BadRequestException('Super admin topilmadi!');
    }
    const super_admin = await this.superAdminRepository.findOne({
      where: { id: id },
    });
    if (!super_admin || !super_admin.hashed_refresh_token) {
      throw new BadRequestException('Super admin topilmadi!');
    }
    const token_match = await compare(
      refresh_token,
      super_admin.hashed_refresh_token,
    );
    if (!token_match) {
      throw new ForbiddenException('Taqiqlanadi!');
    }
    const jwt_payload = {
      id: super_admin.id,
      is_super_admin: super_admin.is_super_admin,
    };
    const token = await generateToken(jwt_payload, this.jwtService);
    const hashed_refresh_token = await hash(token.refresh_token, 7);
    const _super_admin = await this.superAdminRepository.update(
      { hashed_refresh_token },
      { where: { id: super_admin.id }, returning: true },
    );
    await writeToCookie(token.refresh_token, 'super_admin', res);
    return {
      message: 'Super admin refresh tokeni yangilandi',
      token: token.refresh_token,
      super_admin: _super_admin[1][0],
    };
  }

  async updateInfo(id: number, updateSelfInfoDto: UpdateSelfInfoDto) {
    const super_admin = await this.superAdminRepository.update(
      { ...updateSelfInfoDto },
      { where: { id }, returning: true },
    );
    return super_admin[1][0];
  }

  async newPassword(id: number, newPasswordDto: NewPasswordDto) {
    const super_admin = await this.superAdminRepository.findOne({
      where: { id },
    });
    const is_match_password = await compare(
      newPasswordDto.old_password,
      super_admin.hashed_password,
    );
    if (!is_match_password) {
      throw new BadRequestException('Eski parol xato!');
    }
    const hashed_password = await hash(newPasswordDto.new_password, 7);
    const _super_admin = await this.superAdminRepository.update(
      { hashed_password },
      { where: { id: super_admin.id }, returning: true },
    );
    return _super_admin[1][0];
  }
}
