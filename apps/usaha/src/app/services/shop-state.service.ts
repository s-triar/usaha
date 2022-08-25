import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ShopStateService {
  current_shop$:BehaviorSubject<string> = new BehaviorSubject<string>('');
  
  constructor() { }
}
