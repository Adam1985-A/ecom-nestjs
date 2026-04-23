import { Controller, Get, Param } from "@nestjs/common";
import { UsersService } from "./user.service.js";

@Controller('user')
export class UserController{
    constructor(
        private userService: UsersService
    ) {}

    @Get('id')
    getUser(@Param('id') id: number){
        return this.userService.findById(id);
    }
}