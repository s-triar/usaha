import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggle, MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { InputCurrencyComponent } from 'apps/usaha/src/app/components/form/input-currency/input-currency.component';
// import { InputCurrencyComponent } from 'src/app/components/input-currency/input-currency.component';
// import { POSCashierItem } from 'src/app/shared/interfaces';

export type POSCashierItem = {
  id: string;
  enterpriseId: string;
  barcode: string;
  name: string;
  price: number;
  wholesalerPrice: number;
  wholesalerMin: number;
  isWholesalerPriceAuto: boolean;
  isWholesalerPriceUsed: boolean;
  goodsPackaging: string;
  promos: any[];
  singlePriceDisc: number;
  // singlePriceDiscFormatted: string|null;
  totalPriceDisc: number;
  // totalPriceDiscFormatted: string|null;
  usedPrice: number;
  tempUsedTotalPrice: number;
  usedTotalPrice: number;
  qty: number;
};

export interface CashierEventDiscChange{
  value: number;
  id: string;
}

export interface CashierEventQtyChange{
  element: Event;
  id: string;
}
export interface CashierEventToggleWholesalerChange{
  value: boolean;
  id: string;
}

@Component({
  selector: 'usaha-cashier-item',
  templateUrl: './cashier-item.component.html',
  styleUrls: ['./cashier-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    InputCurrencyComponent,
    MatSnackBarModule
  ],
  providers: [
    CurrencyPipe
  ]
})
export class CashierItemComponent implements OnInit, OnChanges {
  @Input() item!: POSCashierItem;

  @Output() newlyAdded = new EventEmitter();

  @Output() singleDiscChange = new EventEmitter<CashierEventDiscChange>();
  @Output() totalDiscChange = new EventEmitter<CashierEventDiscChange>();
  @Output() qtyChange = new EventEmitter<CashierEventQtyChange>();
  @Output() wholesalerToggleChange = new EventEmitter<CashierEventToggleWholesalerChange>();

  isAdditionalPanelOpened = false;
  @ViewChild('qtyinput', {static: true}) qtyInput!: ElementRef;

  constructor(
    private currencyPipe: CurrencyPipe,
    // private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes.item.currentValue.qty !== changes.item.previousValue.qty){
    this.qtyInput.nativeElement.value = changes['item'].currentValue.qty;
    this.qtyInput.nativeElement.dispatchEvent(new InputEvent('change'));
    // }

  }

  ngOnInit(): void {
    this.newlyAdded.emit();
  }

  toogleAdditionalPanel(): void{
    this.isAdditionalPanelOpened = !this.isAdditionalPanelOpened;
  }
  changeSingleDisc(element: InputCurrencyComponent): void{
    const p = element.value;
    this.singleDiscChange.emit({
      value: p!,
      id: this.item.id,
    });
  }

  changeTotalDisc(element: InputCurrencyComponent): void{
    const p = element.value;
    this.totalDiscChange.emit({
      value: p!,
      id: this.item.id,
    });
  }
  toggleWholesaler(element: MatSlideToggleChange): void{
    this.wholesalerToggleChange.emit({
      value: element.checked,
      id: this.item.id
    });
  }
  changeQty(element: Event): void{
    this.qtyChange.emit({
      element,
      id: this.item.id
    });
  }
}
