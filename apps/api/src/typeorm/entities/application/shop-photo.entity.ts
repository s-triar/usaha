import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from '../base.entity';
import { Shop } from './shop.entity';

@Entity({name:'shop_photos'})
export class ShopPhoto extends Base{
    @PrimaryGeneratedColumn({unsigned:true})
    id:number;
    @ManyToOne(()=>Shop,{cascade:true})
    @JoinColumn({name:'shop_id'})
    shop?: Shop;
    @Column({nullable:false,unsigned:true})
    shop_id:number;
    @Column()
    url: string;
}