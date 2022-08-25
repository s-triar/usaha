import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from '../base.entity';
import { ProductGroup } from './product-group.entity';
import { ProductIn } from './product-in.entity';
import { ProductPhoto } from './product-photo.entity';
import { ProductPrice } from './product-price.entity';
import { ProductStock } from './product-stock.entity';
import { ProductType } from './product-type.entity';
import { Shop } from './shop.entity';

@Entity({name:'products'})
@Index('barcode_product_unique_each_shop',['shop_id','barcode'],{unique:true})
export class Product extends Base{
    @PrimaryGeneratedColumn({unsigned:true})
    id: number;
    @ManyToOne(()=>Shop,{cascade:true})
    @JoinColumn({name:'shop_id'})
    shop?: Shop;
    @Column({nullable:false,unsigned:true})
    shop_id:number;
    @Column({nullable:false})
    barcode:string;
    @Column({nullable:false})
    name:string;
    @Column({nullable:true})
    description:string;
    @Column()
    contain:number;
    @Column()
    threshold_stock:number;
    @ManyToOne(()=>ProductType,{cascade:true})
    @JoinColumn({name:'product_type_id'})
    product_type?: ProductType;
    @Column({nullable:false,unsigned:true})
    product_type_id:number;
    @OneToMany(() => ProductIn, (product_in) => product_in.product)
    product_ins?:ProductIn[];
    @ManyToMany(()=>ProductGroup,{cascade:true})
    @JoinTable()
    groups?: ProductGroup[];
    @OneToMany(() => ProductPhoto, (product_photo) => product_photo.product)
    product_photos?:ProductPhoto[];
    @OneToMany(() => ProductPrice, (product_price) => product_price.product)
    product_prices?:ProductPrice[];
    @OneToMany(() => ProductStock, (product_stock) => product_stock.product)
    product_stocks?:ProductStock[];
    @ManyToOne(()=>Product,{cascade:true})
    @JoinColumn({name:'product_parent_id'})
    product_parent?: Product|null;
    @Column({nullable:true,unsigned:true})
    product_parent_id:number|null;
}