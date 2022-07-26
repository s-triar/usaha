import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../auth';
import { Base } from '../base.entity';
import { ShopAddress } from './shop-address.entity';
import { ShopType } from './shop-type.entity';

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
    @ManyToOne(()=>ShopType,{cascade:true})
    @JoinColumn({name:'shop_type_id'})
    shop_type?: ShopType;
    @Column({nullable:false,unsigned:true})
    shop_type_id:number;
    @OneToMany(() => ShopAddress, (shop_address) => shop_address.shop)
    address?:ShopAddress[];
    @ManyToOne(()=>User,{cascade:true})
    @JoinColumn({name:'owner_id'})
    owner?: User;
    @Column({nullable:false,unsigned:true})
    owner_id:number;
    // @ManyToMany(type=>User,{cascade:true})
    // @JoinTable()
    // employees: User[];
    
}