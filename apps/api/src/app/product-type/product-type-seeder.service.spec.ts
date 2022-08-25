import { Test, TestingModule } from '@nestjs/testing';
import { ProductTypeSeederService } from './product-type-seeder.service';

describe('ProductTypeSeederService', () => {
  let service: ProductTypeSeederService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductTypeSeederService],
    }).compile();

    service = module.get<ProductTypeSeederService>(ProductTypeSeederService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
