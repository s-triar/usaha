import { Test, TestingModule } from '@nestjs/testing';
import { HashIdService } from './hash-id.service';

describe('HashIdService', () => {
  let service: HashIdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashIdService],
    }).compile();

    service = module.get<HashIdService>(HashIdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
