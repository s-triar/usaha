import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { WorkspaceStateService } from '../workspace-state.service';

@Component({
  selector: 'usaha-cashier',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.css'],
})
export class CashierComponent implements OnInit {
  constructor(
    private _wsStateService: WorkspaceStateService,
    private _productService:ProductService,
  ) {}

  ngOnInit(): void {
    this._wsStateService.title$.next('Kasir');
    console.log("from workspace/cashier");
    // this._productService.getMyStoreProducts().subscribe();
  }
}
