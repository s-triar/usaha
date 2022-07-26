import { Column, Entity, JoinColumn, ManyToOne,  PrimaryColumn } from 'typeorm';
import { District } from './district.entity';

@Entity({name:'villages'})
export class Village{
    @PrimaryColumn({nullable:false})
    id: string;
    @Column({nullable:false})
    name:string;
    @ManyToOne(()=>District,{cascade:true})
    @JoinColumn({name:'district_id'})
    district?: District;
    @Column({nullable:false})
    district_id:string;
}