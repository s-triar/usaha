import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';


@Entity({name:'product_types'})
export class ProductType{
    @PrimaryGeneratedColumn({unsigned:true})
    id: number;
    @Column({nullable:false})
    name:string;
    @ManyToOne(()=>ProductType,{cascade:true})
    @JoinColumn({name:'product_type_parent_id'})
    product_type_parent?: ProductType|null;
    @Column({nullable:true,unsigned:true})
    product_type_parent_id:number|null;
}