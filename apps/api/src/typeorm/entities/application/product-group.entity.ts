import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from '../base.entity';
import { Product } from './product.entity';
import { Shop } from './shop.entity';

@Entity({name:'product_groups'})
export class ProductGroup extends Base{
    @PrimaryGeneratedColumn({unsigned:true})
    id: number;
    @ManyToOne(()=>Shop,{cascade:true})
    @JoinColumn({name:'shop_id'})
    shop?: Shop;
    @Column({nullable:false,unsigned:true})
    shop_id:number;
    @Column({nullable:false})
    name:string;
    @Column({nullable:true})
    description:string;
    @ManyToMany(()=>Product,{cascade:true})
    @JoinTable()
    members?: Product[];
    
}