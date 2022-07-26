import { Test, TestingModule } from '@nestjs/testing';
import { WilayahAdministrativeController } from './wilayah-administrative.controller';

describe('WilayahAdministrativeController', () => {
  let controller: WilayahAdministrativeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WilayahAdministrativeController],
    }).compile();

    controller = module.get<WilayahAdministrativeController>(
      WilayahAdministrativeController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
