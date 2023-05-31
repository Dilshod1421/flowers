import {
  Injectable,
  ExecutionContext,
  CanActivate,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class IsSuperAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    if (req.user.id != req.params.id || !req.user.is_super_admin) {
      throw new UnauthorizedException({
        message: 'Super admin tasdiqlanmadi!',
      });
    }
    return true;
  }
}
