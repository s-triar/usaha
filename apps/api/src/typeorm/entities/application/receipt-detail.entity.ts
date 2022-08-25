import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from '../base.entity';
import { Product } from './product.entity';
import { Receipt } from './receipt.entity';

@Entity({name:'receipt_details'})
export class ReceiptDetail extends Base{
    @PrimaryGeneratedColumn({unsigned:true})
    id: number;
    @ManyToOne(()=>Receipt,{cascade:true})
    @JoinColumn({name:'receipt_id'})
    receipt?: Receipt;
    @Column({nullable:false,unsigned:true})
    receipt_id:number;
    @ManyToOne(()=>Product,{cascade:true})
    @JoinColumn({name:'product_id'})
    product?: Product;
    @Column({nullable:false,unsigned:true})
    product_id:number;
    @Column()
    n: number;
    @Column()
    is_wholesale_price:boolean;
    @Column({precision:4})
    item_price:number;
    @Column({precision:4})
    discount_per_item:number;
    @Column({precision:4})
    discount_all_items:number;
    @Column({precision:4})
    total_price:number;
}