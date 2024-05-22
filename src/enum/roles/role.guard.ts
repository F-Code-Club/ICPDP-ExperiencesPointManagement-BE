import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './role.decorator';
import { Role } from './role.enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService
  ) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
        ]);
        if (!requiredRoles) {
        return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
        throw new UnauthorizedException('Missing JWT token');
        }

        try {
            const decodedToken = this.jwtService.verify(token);
            request.user = decodedToken;
        } catch (error) {
            throw new UnauthorizedException('Invalid JWT token');
        }
        const user = request.user;
        if (!user || !user.role) { 
            return false; 
        }
        return user.role === 'admin'; 
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authorizationHeader = request.headers['authorization'];
        const [type, token] = authorizationHeader?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}