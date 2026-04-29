import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../users/user.service";
import { InjectRepository } from "@nestjs/typeorm";
import bcrypt from "bcrypt";
import { UserEntity } from "../users/user.entity";
import  { Repository } from "typeorm";


@Injectable()
export class AuthService{
    constructor( 
        @InjectRepository(UserEntity)
        private usersRepo: Repository<UserEntity>,
        private userService: UserService,
        private JwtService: JwtService,

     ) {}

     async register(name: string, email: string, password: string){
        const existingUser = await this.userService.findByEmail(email);
        if(existingUser){
            throw new UnauthorizedException("User already exist");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        return this.userService.create(name, email, hashedPassword);

     }

     async login(email: string, password: string){
        const user = await this.userService.findByEmail(email);
        if(!user || !(await bcrypt.compare(password, user.password))){
            throw new UnauthorizedException("Invalid Credential");

        }
        return {
        access_token: this.JwtService.sign({ sub: user.id, email: user.email}),
     };

    

     }   
     
};
