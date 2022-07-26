import { Module } from '@nestjs/common';
import { WilayahAdministrativeService } from './wilayah-administrative.service';
import { WilayahAdministrativeController } from './wilayah-administrative.controller';
import { WilayahAdministrativeSeederService } from './wilayah-administrative-seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { District, Province, Regency, Village } from '../../typeorm/entities/wilayah';

@Module({
  imports:[
    TypeOrmModule.forFeature([Province, Regency, District, Village])
  ],
  providers: [WilayahAdministrativeService, WilayahAdministrativeSeederService],
  controllers: [WilayahAdministrativeController],
  exports:[
    WilayahAdministrativeService
  ]
})
export class WilayahAdministrativeModule {
  constructor(private _wilayahSeeder:WilayahAdministrativeSeederService){
    this._wilayahSeeder.seedWilayah();
  }
}
