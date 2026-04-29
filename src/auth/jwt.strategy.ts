import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import {UserService } from '../users/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor( 
    private configService: ConfigService,
    private userService: UserService,
  ) {
     const secret = configService.getOrThrow<string>('JWT_SECRET');
    super({
      secretOrKey: secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });

    console.log('🔥 JwtStrategy initialized');
  }

  async validate(payload: { sub: string; email: string}) {
    console.log('✅JWT PAYLOAD:', payload);
    

    const user = await this.userService.findById(payload.sub);
    if(!user || !user.isActive ) {
      throw new UnauthorizedException('Invalid token');

    }
    return user;
  }
}