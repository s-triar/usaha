import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Regency } from './regency.entity';

@Entity({name:'provinces'})
export class Province{
    @PrimaryColumn({nullable:false})
    id: string;
    @Column({nullable:false})
    name:string;
    @OneToMany(() => Regency, (x) => x.province)
    regencies?:Regency[];
}