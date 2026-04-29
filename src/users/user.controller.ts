import { Controller, Get, Param } from "@nestjs/common";
import { UserService } from './user.service';

@Controller('user')
export class UserController{
    constructor(
        private userService: UserService
    ) {}

    @Get('id')
    getUser(@Param('id') id: string){
        return this.userService.findById(id);
    }
}