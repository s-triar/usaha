import { Test, TestingModule } from '@nestjs/testing';
import { ShopPhotoService } from './shop-photo.service';

describe('ShopPhotoService', () => {
  let service: ShopPhotoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopPhotoService],
    }).compile();

    service = module.get<ShopPhotoService>(ShopPhotoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
