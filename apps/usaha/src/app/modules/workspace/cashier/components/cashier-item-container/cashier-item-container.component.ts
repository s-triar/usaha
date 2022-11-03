import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit,  Input, Output, EventEmitter, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InputCurrencyComponent } from '../../../../../components/form/input-currency/input-currency.component';

// import { POSCashierContainerItem, POSCashierItem } from 'src/app/application/types';
// import { InputCurrencyComponent } from 'src/app/components/input-currency/input-currency.component';
// import { POSCashierContainerItem, POSCashierItem } from 'src/app/shared/interfaces';
// import { UtilityService } from 'src/app/shared/services/utility.service';
import { CashierEventDiscChange, CashierEventQtyChange, CashierEventToggleWholesalerChange, CashierItemComponent, POSCashierItem } from './cashier-item/cashier-item.component';

export type POSCashierContainerItem = {
  items: POSCashierItem[],
  totalPayment: number,
  payment: number,
  paymentFormatted: string|null,
  return: number
};

export interface CashierContainerUpdateEvent {
  index: string;
  data: POSCashierContainerItem;
}
export interface CashierContainerPayEvent {
  index: string;
}
export interface CashierContainerCancelEvent {
  index: string;
}
@Component({
  selector: 'usaha-cashier-item-container',
  templateUrl: './cashier-item-container.component.html',
  styleUrls: ['./cashier-item-container.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CashierItemComponent,
    MatFormFieldModule,
    MatInputModule,
    InputCurrencyComponent,
    MatButtonModule
  ],
  providers: [
    CurrencyPipe
  ]
})
export class CashierItemContainerComponent implements OnInit, AfterViewChecked  {

  rst!: any;
  @Input() data!: POSCashierContainerItem;
  @Input() index!: string;

  @Output() update = new EventEmitter<CashierContainerUpdateEvent>();
  @Output() pay = new EventEmitter<CashierContainerPayEvent>();
  @Output() cancel = new EventEmitter<CashierContainerCancelEvent>();

  constructor(
    private currencyPipe: CurrencyPipe,
    private cdr: ChangeDetectorRef,
    // private utilService: UtilityService
  ) { }
  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
  }

  updating(): void{
    this.update.emit({
      data: this.data,
      index: this.index
    });
  }
  paying(): void{
    this.pay.emit({
      index: this.index
    });
  }
  canceling(): void{
    this.cancel.emit({
      index: this.index
    });
  }
  newlyAdded(event: Event): void{
    setTimeout(() => {
      this.updateTotalPayment();
    });
  }

  updateTotalPayment(): void{
    let total = 0;
    this.data.items.forEach(element => {
      total += element.usedTotalPrice;
    });
    this.data.totalPayment = total;
    this.data.return = this.data.payment - this.data.totalPayment;
    this.updating();
  }

  // formatCurrency(event: Event, dataUsed: POSCashierContainerItem|POSCashierItem, varActual: string, varFormatted: string): void{
  //   this.updateTotalPayment();
  // }

  updatePayment(c: InputCurrencyComponent): void{
    const t = (c.value);
    this.data.payment = t!;
    this.updateTotalPayment();
  }

  toggleWholesaler(event: CashierEventToggleWholesalerChange): void{
    const value = event.value;
    const id = event.id;
    const item = this.data.items.find(x => x.id === id);
    if (item !== null && item !== undefined){
      item.isWholesalerPriceUsed = value;
      item.usedPrice = item.isWholesalerPriceUsed ? item.wholesalerPrice : item.price;
      this.calculateUsedTotalPrice(item);
    }
  }

  changeQty(event: CashierEventQtyChange): void{
    const element = event.element;
    const id = event.id;
    const item = this.data.items.find(x => x.id === id);
    const p = (element.target as HTMLInputElement);
    if (p !== undefined && p !== null && item !== null && item !== undefined){
      item.qty = parseFloat(p.value);
      if (item.qty <= 0){
        const idx = this.data.items.findIndex(x => x.id === item.id);
        if (idx > -1){
          this.data.items.splice(idx, 1);
        }
      }
      this.calculateUsedTotalPrice(item);
    }
  }
  singleDiscChange(event: CashierEventDiscChange): void{
    const v = event.value;
    const id = event.id;
    const item = this.data.items.find(x => x.id === id);
    if (item){
      item.singlePriceDisc = v;
      this.calculateUsedTotalPrice(item);
    }
  }
  totalDiscChange(event: CashierEventDiscChange): void{
    const v = event.value;
    const id = event.id;
    const item = this.data.items.find(x => x.id === id);
    if (item){
      item.totalPriceDisc = v;
      this.calculateUsedTotalPrice(item);
    }
  }

  calculateUsedTotalPrice(item: POSCashierItem): void{
    const isWholesalerPriceUsed = item.isWholesalerPriceAuto &&
                                  (item.wholesalerMin <= item.qty && item.wholesalerMin > 0) ? true : false;
    if (item.isWholesalerPriceAuto || (item.wholesalerMin > item.qty)){
      item.isWholesalerPriceUsed = isWholesalerPriceUsed;
    }
    item.usedPrice = ( item.isWholesalerPriceUsed ? item.wholesalerPrice : item.price) - item.singlePriceDisc;
    item.tempUsedTotalPrice = item.usedPrice * item.qty;
    item.usedTotalPrice = item.tempUsedTotalPrice - item.totalPriceDisc;
    this.updateTotalPayment();
  }
}
