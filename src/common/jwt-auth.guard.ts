import { Injectable,ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector){
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [
        context.getHandler(),
        context.getHandler(),
      ],
    );

    //if route is public skip auth
    if(isPublic){
      return true;
    }
    
    console.log('🚨 JwtAuthGuard triggered');
    return super.canActivate(context);
  }

   handleRequest(err: any, user: any, info: any) {
    // 🔴 THIS IS THE FIX
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication required');
    }
    return user;
  }
}
