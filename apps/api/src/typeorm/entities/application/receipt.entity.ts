import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../auth';
import { Base } from '../base.entity';
import { Shop } from './shop.entity';

@Entity({name:'receipts'})
export class Receipt extends Base{
    @PrimaryGeneratedColumn({unsigned:true})
    id: number;
    @ManyToOne(()=>Shop,{cascade:true})
    @JoinColumn({name:'shop_id'})
    shop?: Shop;
    @Column({nullable:false,unsigned:true})
    shop_id:number;
    @Column({precision:4})
    total_price:number;
    // @ManyToOne(()=>User,{cascade:true})
    // @JoinColumn({name:'buyer_id'})
    // buyer?: User;
    // @Column({nullable:true,unsigned:true})
    // buyer_id?:number;
}