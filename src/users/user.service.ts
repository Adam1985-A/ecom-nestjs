import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
    constructor(
     @InjectRepository(UserEntity) 
     private repo: Repository<UserEntity>,    
        
    ) {}

create(name: string, email: string, password: string){
const user = this.repo.create({ name, email, password})
return this.repo.save(user);
}

findByEmail(email: string){
    return this.repo.findOne({ where: {email}});

}

findById(id: string){
    const user = this.repo.findOne({ where: {id}});
    if(!user){
        throw new UnauthorizedException("user not found");
    }
    return user;
}

// ✅ ADD THIS
  async deactivate(id: string): Promise<UserEntity> {
    const user = await this.repo.findOne({ where: { id} });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.isActive = false; // make sure this column exists
    return this.repo.save(user);
  }



findAll(){
    return this.repo.find({ select: ['id', 'email', 'name', 'role', 'isActive', 'createdAt']});

}


}