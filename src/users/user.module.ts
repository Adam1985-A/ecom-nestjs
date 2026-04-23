import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../users/user.entity.js";
import { UserService } from "./user.service.js";
import { UserController } from '../users/user.controller.js';

@Module({
    imports: [ TypeOrmModule.forFeature([UserEntity])],
    providers: [UserService],
    exports: [UserService],
    controllers: [UserController],
})

export class UserModule{}