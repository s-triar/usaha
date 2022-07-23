import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from '../base.entity';

@Entity({name:'users'})
export class User extends Base{
    @PrimaryGeneratedColumn({unsigned:true})
    id: number;
    @Column({unique:true})
    username:string;
    @Column({unique:true})
    email:string;
    @Column()
    phone:string;
    @Column()
    fullname:string;
    @Column()
    password:string;
}