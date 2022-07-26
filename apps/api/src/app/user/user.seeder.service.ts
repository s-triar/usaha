import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from '@usaha/api-interfaces';
import { UserService } from './user.service';

@Injectable()
export class UserSeederService {
    constructor(
        private readonly userService: UserService
      ) {}
    async seedUser():Promise<void>{
      console.log("seed users");
      const users = await this.userService.findAll();
      
      if(users.length==0){
          const user: RegisterUserDto = {
            email:'s.triarjo@gmail.com',
            fullname:'sulaiman triarjo',
            password:'qweasd',
            phone:'085755519123',
            username:'s.triar',
            confirmPassword: 'qweasd'
          };
          const id = await this.userService.create(user);      
          console.log("new user id = ",id);
      }
    }
     
}