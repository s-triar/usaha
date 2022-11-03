import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import { ShopStateService } from '../../services/shop-state.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BackDirective } from '../../directives/back/back.directive';
import {A11yModule} from '@angular/cdk/a11y';
import { WorkspaceStateService } from './workspace-state.service';
import { Observable } from 'rxjs';
import { MatListModule } from '@angular/material/list';
export type DrawerMenuItem={
  name:string;
  path:string;
  icon:string;
}
@Component({
  selector: 'usaha-workspace',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    BackDirective,
    A11yModule,
    MatListModule
  ],
  providers:[ShopStateService, WorkspaceStateService],
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css'],
})
export class WorkspaceComponent implements OnInit, OnDestroy, AfterViewChecked {
  title$!:Observable<string>;
  drawerMenu: DrawerMenuItem[]=[
    {
      name:'Kasir',
      path:'cashier',
      icon: 'shopping_basket'
    },
    {
      name:'Produk',
      path:'product',
      icon: 'price_change'
    },
    {
      name:'Pengaturan',
      path:'settings',
      icon: 'settings'
    }
  ]
  constructor(
    private _route:ActivatedRoute,
    private _shopStateService:ShopStateService,
    private _wsStateService: WorkspaceStateService,
    private _cdr: ChangeDetectorRef
  ) {
    
  }
  ngAfterViewChecked(): void {
    this._cdr.detectChanges();
}
  ngOnDestroy(): void {
    this._shopStateService.current_shop$.next('');
  }

  ngOnInit(): void {
    // console.log(this._route.snapshot.data['shop_id'],'data');
    
    const shop_id = this._route.snapshot.data['shop_id'];
    this._shopStateService.current_shop$.next(shop_id);

      this.title$ = this._wsStateService.title$;

  }
  
}
