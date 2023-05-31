import {
  Injectable,
  ExecutionContext,
  CanActivate,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth_header = req.headers.authorization;
    if (!auth_header) {
      throw new UnauthorizedException({
        message: 'Token topilmadi!',
      });
    }
    const bearer = auth_header.split(' ')[0];
    const token = auth_header.split(' ')[1];
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException({
        message: 'Token topilmadi!',
      });
    }
    let user: any;
    try {
      user = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
      req.user = user;
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Tokenda muammo!',
        error,
      });
    }
    return true;
  }
}
