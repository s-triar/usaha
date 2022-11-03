import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { ProductCashierSearchDto } from '@usaha/api-interfaces';

// import { MyGoodsForCashierDto } from 'src/app/shared/types/Dtos';

@Component({
  selector: 'usaha-cashier-item-search',
  templateUrl: './cashier-item-search.component.html',
  styleUrls: ['./cashier-item-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
  ],
  providers: [
    CurrencyPipe
  ]
})
export class CashierItemSearchComponent implements OnInit {

  @Input() item!: ProductCashierSearchDto;

  constructor() { }

  ngOnInit(): void {
  }

}
