import { Column, Entity, JoinColumn, ManyToOne,  OneToMany,  PrimaryColumn } from 'typeorm';
import { Regency } from './regency.entity';
import { Village } from './village.entity';

@Entity({name:'districts'})
export class District{
    @PrimaryColumn({nullable:false})
    id: string;
    @Column({nullable:false})
    name:string;
    @ManyToOne(()=>Regency,{cascade:true})
    @JoinColumn({name:'regency_id'})
    regency?: Regency;
    @Column({nullable:false})
    regency_id:string;
    @OneToMany(() => Village, (x) => x.district)
    villages?:Village[];
}