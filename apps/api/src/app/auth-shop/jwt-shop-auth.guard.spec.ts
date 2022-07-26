import { JwtShopAuthGuard } from './jwt-shop-auth.guard';

describe('JwtShopAuthGuard', () => {
  it('should be defined', () => {
    expect(new JwtShopAuthGuard()).toBeDefined();
  });
});
