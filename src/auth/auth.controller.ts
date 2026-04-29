import { Controller, Post, Get, Body, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "../common/jwt-auth.guard"; 
import { GetUser } from "../common/get-user.decorator";


@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService){}

    @Post("register")
    register(@Body() body:any){
        return this.authService.register(body.name, body.email, body.password);

    }

    @Post("login")
    login(@Body() body: any){
        return this.authService.login(body.email, body.password)
    }

    // ✅ ADD THIS
  @Get("me")
  @UseGuards(JwtAuthGuard)
  getMe(@GetUser() user: any) {
    return user;
  }
}
