import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CashierProductSearchRequest, ProductCashierSearchDto } from '@usaha/api-interfaces';
import { Observable, of } from 'rxjs';
import { showErrorDialogContext } from '../interceptors/notification.interceptor';
import { FormConversionService } from './form-conversion.service';


export type ItemOrdered= {
  GoodsId: string;
  IsWholesalerPrice: boolean;
  DiscountItem: number;
  DiscountItemTotal: number;
  PricePerItem: number;
  PricePerItemAfterDiscount: number;
  PriceTotal: number;
  PriceTotalAfterDiscount: number;
  PriceTotalFinal: number;
  N: number;
};
export type CreateOrderCashierCommand = {
  EnterpriseId: string;
  Total: number;
  Payment: number;
  Return: number;
  To: string;
  Items: ItemOrdered[];
};

export interface CashierServiceInterface{
  get(query: CashierProductSearchRequest): Observable<ProductCashierSearchDto[]>;
  pay(data: CreateOrderCashierCommand): Observable<void>;
}
@Injectable({
  providedIn: 'root',
})
export class CashierService implements CashierServiceInterface {

  constructor(
    private httpClient: HttpClient,
    private utilService: FormConversionService
  ) {
    
  }
  pay(data: CreateOrderCashierCommand): Observable<void> {
    return this.httpClient.post<void>('api/order/create',data, {context: showErrorDialogContext()});
  }
  get(query: CashierProductSearchRequest): Observable<ProductCashierSearchDto[]> {
    const params = new HttpParams({
      fromObject: {...query}
    });
    
    return this.httpClient.get<ProductCashierSearchDto[]>('api/product/for-cashier', {params: params});
  }
}
