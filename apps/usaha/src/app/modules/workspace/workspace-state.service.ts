import { Injectable } from '@angular/core';
import { MyShopInfoDto } from '@usaha/api-interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceStateService {
  title$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  shop_info$:BehaviorSubject<MyShopInfoDto|null> = new BehaviorSubject<MyShopInfoDto|null>(null);
  constructor() { }

}
