import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import { ShopStateService } from '../../services/shop-state.service';

@Component({
  selector: 'usaha-workspace',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule
  ],
  providers:[ShopStateService],
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css'],
})
export class WorkspaceComponent implements OnInit, OnDestroy {
  constructor(
    private _route:ActivatedRoute,
    private _shopStateService:ShopStateService
  ) {}
  ngOnDestroy(): void {
    this._shopStateService.current_shop$.next('');
  }

  ngOnInit(): void {
    const shop_id = this._route.snapshot.data['shop_id']; 
    this._shopStateService.current_shop$.next(shop_id);
  }
  
}
