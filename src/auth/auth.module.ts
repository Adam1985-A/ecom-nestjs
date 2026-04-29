import { Module, OnModuleInit } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from '@nestjs/passport';
import { AuthController } from "./auth.controller";
import { UserModule } from "../users/user.module";
import { JwtStrategy } from "./jwt.strategy";
import { UserEntity } from "../users/user.entity";
import { AuthService } from "./auth.service";

@Module({
   
    imports: [ 
     
      TypeOrmModule.forFeature([UserEntity]),
        UserModule,
         PassportModule.register({ defaultStrategy: 'jwt' }),
     JwtModule.registerAsync({
        imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.getOrThrow<string>('JWT_SECRET'),
    signOptions: { expiresIn: '1d' },
  }),
         

     }),
     
     ],

     providers: [ AuthService, JwtStrategy ],
     controllers: [AuthController],
     exports: [PassportModule, JwtModule, JwtStrategy], // ✅ ADD THIS
})

export class AuthModule implements OnModuleInit {
  constructor(private jwtStrategy: JwtStrategy) {} // 👈 FORCE INJECTION

  onModuleInit() {
    console.log('🔥 AuthModule initialized');
  }
}


