import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { POSCashierList, POSCashierContainerItem, POSCashierItem } from 'src/app/application/types';
import { MyGoodsForCashierDto } from 'src/app/domain/backend/Dtos';

import {v1 as uuidV1} from 'uuid';
@Injectable({
  providedIn: 'root'
})
export class CashierDataService {
  POSList: BehaviorSubject<POSCashierList> = new BehaviorSubject<POSCashierList>({});
  constructor() {
    this.addBuffer();
  }
  getId(): string{
    const d = new Date();
    const n = this.getstr(d.getHours()) + this.getstr(d.getMinutes()) + this.getstr(d.getSeconds()) + this.getstr(d.getMilliseconds());
    return n;
  }

  getstr(n: number): string{
    const bag = 'aA0bBcCd1DeEfF2gGh3HiIj4JkK5lLm6MnN7oOp8PqQr9RsStTuUvVwWxXyYzZqweQWEasdASDzxcZXCr1t2y3RTY4f5ghF6G7Hvb8nVB9Nu0iopUIOPjklJKLmM1234567890';
    const r = Math.floor(n % 100);
    let h = 0;
    let res = '';
    if (n > 100){
      h = Math.floor(n / 100);
      res = bag.charAt(h) + bag.charAt(r);
    }else{
      res = bag.charAt(r);
    }
    return res;
  }

  addBuffer(desireKey: string|null = null): void{
    const temp = this.POSList.value;
    // uuidV1()
    const key = desireKey ?? uuidV1();
    temp[key] = {
      items: [],
      payment: 0,
      return: 0,
      totalPayment: 0,
      paymentFormatted: null
    };
    this.POSList.next(temp);
  }

  removeBuffer(key: string): void{
    const temp = this.POSList.value;
    delete temp[key];
    const tempQueue = [];
    // tslint:disable-next-line:forin
    for (const k in temp) {
      tempQueue.push(k);
    }
    if (tempQueue.length < 1){
      this.addBuffer();
    }else{
      this.POSList.next(temp);
    }
  }

  add(index: string, item: MyGoodsForCashierDto): void{
    // console.log(item.barcode);
    const temp = this.POSList.value;
    const tempIndex = temp[index];
    const indexProd = tempIndex.items.findIndex(x => x.barcode === item.barcode);
    // console.log(indexProd);
    if ( indexProd === -1){
      tempIndex.items.push(this.convertDTOtoItem(item));
    }
    else{
      // tempIndex.items[indexProd].qty = tempIndex.items[indexProd].qty + 1;
      // tempIndex.items = tempIndex.items.map(x => Object.assign({}, x));
      tempIndex.items[indexProd] = this.createNewObjectForAdd(tempIndex.items[indexProd]);
    }
    this.POSList.next(temp);
  }
  update(index: string, data: POSCashierContainerItem): void{
    const temp = this.POSList.value;
    temp[index] = data;
    this.POSList.next(temp);
  }
  createNewObjectForAdd(item: POSCashierItem): POSCashierItem{
    const incrementQty = item.qty + 1;
    const isWholesalerPriceUsed = item.isWholesalerPriceAuto &&
                                  (item.wholesalerMin <= incrementQty && item.wholesalerMin > 0) ? true : false;
    const usedPrice =  (isWholesalerPriceUsed ?  item.wholesalerPrice : item.price) - item.singlePriceDisc;
    const tempUsedTotalPrice = incrementQty * usedPrice;
    const usedTotalPrice = tempUsedTotalPrice - item.totalPriceDisc;
    return {
      barcode: item.barcode,
      enterpriseId: item.enterpriseId,
      goodsPackaging: item.goodsPackaging,
      id: item.id,
      isWholesalerPriceAuto: item.isWholesalerPriceAuto,
      wholesalerMin: item.wholesalerMin,
      isWholesalerPriceUsed,
      name: item.name,
      price: item.price,
      promos: item.promos,
      qty: incrementQty,
      singlePriceDisc: item.singlePriceDisc,
      // singlePriceDiscFormatted: item.singlePriceDiscFormatted,
      totalPriceDisc: item.totalPriceDisc,
      // totalPriceDiscFormatted: item.totalPriceDiscFormatted,
      usedPrice,
      usedTotalPrice,
      wholesalerPrice: item.wholesalerPrice,
      tempUsedTotalPrice
    };
  }
  convertDTOtoItem(item: MyGoodsForCashierDto): POSCashierItem {
    const isWholesalerPriceUsed = item.isWholesalerPriceAuto && (item.wholesalerMin === 1) ? true : false;
    const usedPrice = isWholesalerPriceUsed ?  item.wholesalerPrice : item.price;
    return {
      barcode: item.barcode,
      enterpriseId: item.enterpriseId,
      goodsPackaging: item.goodsPackaging,
      id: item.id,
      isWholesalerPriceAuto: item.isWholesalerPriceAuto,
      wholesalerMin: item.wholesalerMin,
      isWholesalerPriceUsed,
      name: item.name,
      price: item.price,
      promos: item.promos,
      qty: 1,
      singlePriceDisc: 0,
      // singlePriceDiscFormatted: null,
      totalPriceDisc: 0,
      // totalPriceDiscFormatted: null,
      usedPrice,
      usedTotalPrice: usedPrice,
      wholesalerPrice: item.wholesalerPrice,
      tempUsedTotalPrice: usedPrice
    };
  }
  checkKey(key: string): boolean{
    console.log(this.POSList.value[key], !!this.POSList.value[key]);
    return !!this.POSList.value[key];
  }
}
