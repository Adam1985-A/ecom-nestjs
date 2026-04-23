import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthController } from "./auth.controller.js";
import { UserModule } from "../users/user.module.js";
import { JwtStrategy } from "../auth/jwt.strategy.js";
import { UserEntity } from "../users/user.entity.js";
import { AuthService } from "../auth/auth.service.js";

@Module({
    imports: [
        UserModule,
     JwtModule.register({
        secret: "SECRET_KEY",
        signOptions: { expiresIn: "1d" },
         

     }),
     
     ],

     providers: [ AuthService, JwtStrategy ],
     controllers: [AuthController],
})

export class AuthModule {}
