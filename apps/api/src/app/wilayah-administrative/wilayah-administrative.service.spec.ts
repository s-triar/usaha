import { Test, TestingModule } from '@nestjs/testing';
import { WilayahAdministrativeService } from './wilayah-administrative.service';

describe('WilayahAdministrativeService', () => {
  let service: WilayahAdministrativeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WilayahAdministrativeService],
    }).compile();

    service = module.get<WilayahAdministrativeService>(
      WilayahAdministrativeService
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
