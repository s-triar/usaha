import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'usaha-cashier',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.css'],
})
export class CashierComponent implements OnInit {
  constructor(
    private _productService:ProductService
  ) {}

  ngOnInit(): void {
    console.log("from workspace/cashier");
    this._productService.getMyStoreProducts().subscribe();
  }
}
