import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from '../base.entity';
import { Shop } from './shop.entity';

@Entity({name:'shop_addresses'})
export class ShopAddress extends Base{
    @PrimaryGeneratedColumn({unsigned:true})
    id: number;
    @ManyToOne(() => Shop, (shop) => shop.address)
    shop: Shop
    @Column({nullable:false})
    province:string;
    @Column({nullable:false})
    city:string;
    @Column({nullable:false})
    district:string;
    @Column({nullable:false})
    village:string;
    @Column({nullable:false})
    street:string;
    @Column({nullable:false})
    postal_code:string;
    @Column({nullable:true})
    geo_map_location?:string|null;
}