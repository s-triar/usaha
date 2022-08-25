import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from '../base.entity';
import { Product } from './product.entity';

@Entity({name:'product_photos'})
export class ProductPhoto extends Base{
    @PrimaryGeneratedColumn({unsigned:true})
    id:number;
    @ManyToOne(()=>Product,{cascade:true})
    @JoinColumn({name:'product_id'})
    product?: Product;
    @Column({nullable:false,unsigned:true})
    product_id:number;
    @Column()
    url: string;
}