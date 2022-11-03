import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { WorkspaceStateService } from '../workspace-state.service';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import {
  CashierContainerCancelEvent,
  CashierContainerPayEvent,
  CashierContainerUpdateEvent,
  CashierItemContainerComponent,
  POSCashierContainerItem,
} from './components/cashier-item-container/cashier-item-container.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyShopInfoDto, ProductCashierSearchDto } from '@usaha/api-interfaces';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { PrintService } from 'ng-thermal-print';
import { debounceTime, distinctUntilChanged, filter, map, Observable, of, switchMap, take } from 'rxjs';
import { PopUpConfirmationService } from '../../../components/pop-up/pop-up-confirmation/pop-up-confirmation.service';
import { PopUpNotifService } from '../../../components/pop-up/pop-up-notif/pop-up-notif.service';
import { CashierService, CreateOrderCashierCommand, ItemOrdered } from '../../../services/cashier.service';
import { CashierDataService } from './cashier-data.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AddQueuePopupComponent } from './components/add-queue-popup/add-queue-popup.component';
import { CashierItemSearchComponent } from './components/cashier-item-search/cashier-item-search.component';
import { SearchInputBarcodeComponent } from '../../../components/form/search-input-barcode/search-input-barcode.component';

export type ReceiptItem = {
  qty: string;
  name: string;
  price: string;
  subPrice: string;
};

export type Receipt = {
  enterpriseName: string;
  phone: string;
  receiptId: string;
  items: ReceiptItem[];
  total: string;
  payment: string;
  return: string;
  to: string;
};

@UntilDestroy()
@Component({
  selector: 'usaha-cashier',
  standalone: true,
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    CashierItemContainerComponent,
    CashierItemSearchComponent,
    SearchInputBarcodeComponent
  ],
  providers: [
    CurrencyPipe
  ]
})

export class CashierComponent implements OnInit {
  icons = {
    queue: 'format_list_numbered',
    close: 'close',
    delete: 'delete',
    add: 'add',
  };
  printerConnectionStatus = false;
  idUsaha!: string;
  usahaInfo!: MyShopInfoDto|null;
  bufferOpened = false;
  temp: number[] = [];
  posList!: POSCashierContainerItem;
  totalQueue!: string[];
  indexQueueCurrent = '';
  searchList$: Observable<ProductCashierSearchDto[]> = of([]);
  formSearch = this.formBuilder.group({
    search: this.formBuilder.control<string | null>(''),
  });

  constructor(
    private _wsStateService: WorkspaceStateService,
    private _productService: ProductService,
    private routes: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cashierService: CashierService,
    private cashierDataService: CashierDataService,
    private confirmationService: PopUpConfirmationService,
    private notifService: PopUpNotifService,
    private printService: PrintService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.printService.isConnected.subscribe((result) => {
      this.printerConnectionStatus = result;
      if (result) {
        console.log('Connected to printer!!!');
        this.snackbar.open('Tersambung ke printer.', 'Ok', { duration: 1000 });
      } else {
        console.log('Not connected to printer.');
        this.snackbar.open('Gagal menyambungkan ke printer.', 'Ok', {
          duration: 1000,
        });
      }
    });
  }

  ngOnInit(): void {
    this._wsStateService.shop_info$.pipe(untilDestroyed(this)).subscribe(x=>this.usahaInfo=x);
    this._wsStateService.title$.next('Kasir');
    console.log('from workspace/cashier');
    // this._productService.getMyStoreProducts().subscribe();
    this.loadData();
    this.routes.parent?.params.pipe(untilDestroyed(this)).subscribe(params => {
      console.log(params);
      // this.idUsaha = params[this.PARAM_WORKSPACE_ID_USAHA.substring(1)];
    });
    this.searchProduct();
  }

  update(event: CashierContainerUpdateEvent ): void{
    this.cashierDataService.update(event.index, event.data);
  }
  pay(event: CashierContainerPayEvent ): void{
    const dialogRef = this.confirmationService.show({
      message: 'Periksa kembali produk-produk, kuantitas produk-produk, dan Uang Pembayaran. Tekan OK untuk melanjutkan.',
      title: 'Apakah Anda Yakin?',
      buttonTheme: 'primary'
    });
    dialogRef.afterClosed()
      .pipe(
        untilDestroyed(this),
        filter(x => !!x),
        switchMap(x => this.cashierService.pay(this.createPaymentCommand(this.posList))),
        switchMap(x => this.notifService.show({message: 'Pembayaran berhasil dilakukan.', title: 'Sukses', type: 'success'}).afterClosed())
    ).subscribe(x => {
        this.printReceipt(this.createStringReceipt(x, this.posList));
        this.removeBuffer();
    });
  }
  private printReceipt(data: Receipt): void{
    if (!this.printerConnectionStatus){
      this.notifService.show({type: 'warning', message: 'Printer tidak tersambung', title: 'Perhatian!'});
      return;
    }

    // print store
    let printing = this.printService.init()
        .setJustification('center')
        .setBold(true)
        .setSize('normal')
        .writeLine(data.enterpriseName)
        .setBold(true)
        .setSize('normal')
        .writeLine(data.phone)
        .setJustification('left')
        .writeLine(`Id: ${data.receiptId}`);
    printing = printing.writeLine();

    // print item
    for (const item of data.items){
      printing = printing
                  .setBold(false)
                  .setJustification('left')
                  .writeLine(`${item.name}`)
                  .setJustification('right')
                  .writeLine(this.middleSpacing((`${item.qty} x ${item.subPrice}`), item.price));
    }
    printing = printing.writeLine(`________________________________`);
    // print payment detail
    printing.setBold(false)
            .setJustification('right')
            .writeLine(this.middleSpacing('Total:', data.total))
            .writeLine(this.middleSpacing('Bayar:', data.payment))
            .writeLine(this.middleSpacing('Kembalian:', data.return))
            .feed(3)
            .cut('full')
            .flush();

  }
  private middleSpacing(left: string, right: string, charNumber: number= 32): string{
    let res = left;
    const lDataLeft = left.length;
    const lDataRight = right.length;
    const lSpace = charNumber - (lDataLeft + lDataRight);
    for (let i = 0; i < lSpace; i++){
      res += ' ';
    }
    res += right;
    return res;
  }
  private createStringReceipt(id: string, data: POSCashierContainerItem): Receipt{
    const items: ReceiptItem[] = [];
    for (const item of data.items){
      items.push({
        name: item.name,
        price: item.usedTotalPrice.toString(),
        qty: item.qty.toString(),
        subPrice: item.usedPrice.toString()
      });
    }
    const res: Receipt = {
      enterpriseName: this.usahaInfo?.name ?? 'Error!',
      phone: this.usahaInfo?.phone ?? 'Error!',
      total: data.totalPayment.toString(),
      payment: data.payment.toString(),
      return: data.return.toString(),
      items,
      receiptId: id,
      to: this.indexQueueCurrent
    };

    return res;
  }

  private createPaymentCommand(data: POSCashierContainerItem): CreateOrderCashierCommand{
    const temp: CreateOrderCashierCommand = {
      Items : [],
      Payment: data.payment,
      Return: data.return,
      Total: data.totalPayment,
      EnterpriseId: this.idUsaha,
      To: this.indexQueueCurrent
    };
    data.items.forEach(x => {
      const tempItem: ItemOrdered = {
        GoodsId: x.id,
        IsWholesalerPrice: x.isWholesalerPriceUsed,
        N: x.qty,
        DiscountItem: x.singlePriceDisc,
        DiscountItemTotal: x.totalPriceDisc,
        PricePerItem: x.isWholesalerPriceUsed ? x.wholesalerPrice : x.price,
        PricePerItemAfterDiscount: x.usedPrice,
        PriceTotal: x.tempUsedTotalPrice,
        PriceTotalAfterDiscount: x.usedTotalPrice,
        PriceTotalFinal: x.usedTotalPrice,
      };
      temp.Items.push(tempItem);
   });
    return temp;
  }

  cancel(event: CashierContainerCancelEvent): void{
    const dialogRef = this.confirmationService.show({
      message: 'Pembatalan akan menyebabkan item-item yang sudah ada di POS kasir buffer ini hilang. Tekan OK untuk melanjutkan.',
      title: 'Apakah Anda Yakin?',
      buttonTheme: 'primary'
    });
    dialogRef.afterClosed()
      .pipe(
        untilDestroyed(this),
        filter(x => !!x)
    ).subscribe(x => {
        this.removeBuffer();
    });
  }
  async addItem(item: string): Promise<void>{
    this.searchList$.pipe(take(1))
      .subscribe(list => {
        const p = list.find(y => y.id === item);
        if (p){
          this.cashierDataService.add(this.indexQueueCurrent, p);
          this.formSearch.controls.search.setValue(null);
          this.formSearch.controls.search.updateValueAndValidity();
        }
      });
  }

  searchProduct(): void{
    this.formSearch.controls.search
    .valueChanges
      .pipe(
        untilDestroyed(this),
        debounceTime(400),
        distinctUntilChanged(),
        // switchMap(x => {
        //   console.log(x);
        //   if (x){
        //     return this.cashierService.get({Search: x});
        //   }else{
        //     return of([]);
        //   }
        // })
        )
        .subscribe(x => {
          console.log(x);
          if (x){
            this.searchList$ = this.cashierService.get({search: x, shop_id: this.idUsaha});
          }else{
            this.searchList$ = of([]);
          }
        });
  }
  changeBuffer(index: string): void{
    this.indexQueueCurrent = index;
    this.loadData();
  }
  loadData(): void{
    this.cashierDataService.POSList.pipe(
      untilDestroyed(this),
      map(x => x[this.indexQueueCurrent])
    ).subscribe(x => {
      this.posList = x;
    });
    this.cashierDataService.POSList.pipe(
      untilDestroyed(this),
      map(x => {
        const tempQueue = [];
        // tslint:disable-next-line:forin
        for (const key in x) {
          tempQueue.push(key);
        }
        return tempQueue;
    })).subscribe(x => {
      this.totalQueue = x;
      if (this.indexQueueCurrent === ''){
        this.changeBuffer(this.totalQueue[0]);
      }
    });
  }
  toggleBuffer(state: string): void{
    switch (state) {
      case 'open':
        this.bufferOpened = true;
        break;
      case 'close':
        this.bufferOpened = false;
        break;
      default:
        break;
    }
  }
  addBuffer(): void{
    this.dialog.open(AddQueuePopupComponent, {
      autoFocus: true,
      disableClose: false,
      hasBackdrop: true
    }).afterClosed()
    .pipe(
      filter(x => !!x),
    )
    .subscribe(x => {
      if (typeof(x) === 'string'){
        this.cashierDataService.addBuffer(x);
      }else{
        this.cashierDataService.addBuffer();
      }
    });
  }
  removeBuffer(): void{
    this.cashierDataService.removeBuffer(this.indexQueueCurrent);
    this.indexQueueCurrent = '';
    this.loadData();
  }
}
