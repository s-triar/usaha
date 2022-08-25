import { Test, TestingModule } from '@nestjs/testing';
import { ProductInService } from './product-in.service';

describe('ProductInService', () => {
  let service: ProductInService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductInService],
    }).compile();

    service = module.get<ProductInService>(ProductInService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
