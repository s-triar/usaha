import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import { AuthShopStateService } from '../../services/auth-shop-state.service';

@Component({
  selector: 'usaha-workspace',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule
  ],
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css'],
})
export class WorkspaceComponent implements OnInit, OnDestroy {
  constructor(
    private _route:ActivatedRoute,
    private _shopAuthService:AuthShopStateService
  ) {}
  ngOnDestroy(): void {
    this._shopAuthService.loggedOut();
  }

  ngOnInit(): void {
    
    const shop_token = this._route.snapshot.data['shop_token'].shop_access_token; 
    this._shopAuthService.loggedIn(shop_token);
    console.log("from workspace");
    
  }
}
