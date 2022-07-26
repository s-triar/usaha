import { Test, TestingModule } from '@nestjs/testing';
import { WilayahAdministrativeSeederService } from './wilayah-administrative-seeder.service';

describe('WilayahAdministrativeSeederService', () => {
  let service: WilayahAdministrativeSeederService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WilayahAdministrativeSeederService],
    }).compile();

    service = module.get<WilayahAdministrativeSeederService>(
      WilayahAdministrativeSeederService
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
