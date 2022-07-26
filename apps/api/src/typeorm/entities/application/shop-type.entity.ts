import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from '../base.entity';

@Entity({name:'shop_types'})
export class ShopType extends Base{
    @PrimaryGeneratedColumn({unsigned:true})
    id: number;
    @Column({nullable:false})
    name:string;
}