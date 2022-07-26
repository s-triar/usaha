import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  RegisterUserDto, UserDto } from '@usaha/api-interfaces';
import { Repository } from 'typeorm/repository/Repository';
import { User } from '../../typeorm/entities/auth/User.entity';
import { environment } from '../../environments/environment';
import * as bcrypt from 'bcrypt';
import { HashIdService } from '../hash-id/hash-id.service';

@Injectable()
export class UserService{
    constructor(
        @InjectRepository(User) private _usersRepository: Repository<User>,
        private _hasher: HashIdService
      ) {
        
      }
      
      async create(user: RegisterUserDto):Promise<string>{
        // console.log("lg inn", this._currentUser.user);
        if(user.confirmPassword !== user.password){
          throw new UnprocessableEntityException("password and confirm password do not match");   
      }
        const user_email = await this.findOneByEmail(user.email);
        const user_username = await this.findOneByUsername(user.username);
        if(user_email !== null || user_username!==null){
            throw new UnprocessableEntityException("email or username is already exist");   
        }
        const {confirmPassword, ...usert}=user
        const candidate: User = {
          ...usert, 
          id:0,
          created_at: new Date(),
          created_by_id:null, //this._currentUser.user? this._currentUser.user.id : null
        };
        candidate.password = await bcrypt.hash(candidate.password, environment.saltNumber);
        const new_user =  await this._usersRepository.save(candidate)
        return await this._hasher.encrypt(new_user.id);
      }

      findAll(): Promise<User[]> {
        return this._usersRepository.find();
      }
      findOneByHashedId(id: string): Promise<User> {
        const id_decode = this._hasher.decrypt(id);
        return this._usersRepository.findOneBy({ id:id_decode });
      }
      async findOneByUsername(username: string): Promise<User> {
        
        return await this._usersRepository.findOneBy({ username:username });
      }
      findOneByEmail(email: string): Promise<User> {
        return this._usersRepository.findOneBy({ email });
      }
      async remove(id: string): Promise<void> {
        const id_decode = this._hasher.decrypt(id);
        await this._usersRepository.softDelete({id:id_decode});
      }
      async update(user: UserDto): Promise<void>{
        const idt = this._hasher.decrypt(user.id);
        const {id, ...userr}=user;
        await this._usersRepository.update({id:idt},userr);
      }
}
