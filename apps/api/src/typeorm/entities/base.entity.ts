import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { User } from './auth';

@Entity()
export class Base{
    @CreateDateColumn()
    created_at:Date;
    @ManyToOne(type=>User,{cascade:true,nullable:true})
    @JoinColumn({name:'created_by_id'})
    created_by?: User|null;
    @Column({nullable:true,unsigned:true})
    created_by_id?:number|null;
    @UpdateDateColumn({nullable:true})
    updated_at?:Date|null;
    @ManyToOne(type=>User,{cascade:true,nullable:true})
    @JoinColumn({name:'updated_by'})
    updated_by?: User|null;
    @Column({nullable:true,unsigned:true})
    updated_by_id?:number|null;
    @DeleteDateColumn({nullable:true})
    deleted_at?:Date|null;
    @ManyToOne(type=>User,{cascade:true,nullable:true})
    @JoinColumn({name:'deleted_by_id'})
    deleted_by?: User|null;
    @Column({nullable:true,unsigned:true})
    deleted_by_id?:number|null;
}