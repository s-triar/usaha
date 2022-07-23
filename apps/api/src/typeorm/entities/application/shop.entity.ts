import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../auth';
import { Base } from '../base.entity';

@Entity({name:'shops'})
export class Shop extends Base{
    @PrimaryGeneratedColumn({unsigned:true})
    id: number;
    @Column({unique:true, nullable:false})
    shop_code:string;
    @Column({nullable:false})
    name:string;
    @Column({nullable:true})
    email?:string;
    @Column({nullable:true})
    photo?:string;
    @Column({nullable:false})
    phone:string;
    @Column({nullable:false})
    address:string;
    @Column({nullable:true})
    location?:string;
    @ManyToOne(type=>User,{cascade:true})
    @JoinColumn({name:'owner_id'})
    owner?: User;
    @Column({nullable:false,unsigned:true})
    owner_id:number;
    // @ManyToMany(type=>User,{cascade:true})
    // @JoinTable()
    // employees: User[];
    
}