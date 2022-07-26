import { Test, TestingModule } from '@nestjs/testing';
import { ShopTypeService } from './shop-type.service';

describe('ShopTypeService', () => {
  let service: ShopTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopTypeService],
    }).compile();

    service = module.get<ShopTypeService>(ShopTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
