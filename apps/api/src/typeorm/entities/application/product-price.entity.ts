import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from '../base.entity';
import { Product } from './product.entity';

@Entity({name:'product_prices'})
export class ProductPrice extends Base{
    @PrimaryGeneratedColumn({unsigned:true})
    id:number;
    @ManyToOne(()=>Product,{cascade:true})
    @JoinColumn({name:'product_id'})
    product?: Product;
    @Column({nullable:false,unsigned:true})
    product_id:number;
    @Column({precision:3})
    wholesale_price: number;
    @Column({precision:3})
    price:number;
    @Column({default:false})
    is_auto_wholesale_price?:boolean;
    @Column({default:0})
    min_wholesale_price?:number;
}