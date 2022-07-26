import { Test, TestingModule } from '@nestjs/testing';
import { ShopTypeSeederService } from './shop-type-seeder.service';

describe('ShopTypeSeederService', () => {
  let service: ShopTypeSeederService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopTypeSeederService],
    }).compile();

    service = module.get<ShopTypeSeederService>(ShopTypeSeederService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
