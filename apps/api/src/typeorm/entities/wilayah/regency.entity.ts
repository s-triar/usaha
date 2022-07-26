import { Column, Entity, JoinColumn, ManyToOne,  OneToMany,  PrimaryColumn } from 'typeorm';
import { District } from './district.entity';
import { Province } from './province.entity';

@Entity({name:'regencies'})
export class Regency{
    @PrimaryColumn({nullable:false})
    id: string;
    @Column({nullable:false})
    name:string;
    @ManyToOne(()=>Province,{cascade:true})
    @JoinColumn({name:'province_id'})
    province?: Province;
    @Column({nullable:false})
    province_id:string;
    @OneToMany(() => District, (x) => x.regency)
    districts?:District[];
}