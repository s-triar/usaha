import { CurrencyPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { POSCashierContainerItem, POSCashierItem } from '../types';

@Injectable({
  providedIn: 'root'
})
export class CurrencyConversionService {
  private re = new RegExp('^[0-9]+(\.{0,1}[0-9]+)$');
  private re2 = new RegExp('^\-{0,1}[0-9]+(\.{0,1}[0-9]+)$');
  constructor(private cp: CurrencyPipe) { }

  public formatCurrency(event: Event, dataUsed: POSCashierContainerItem|POSCashierItem, varActual: string, varFormatted: string): void{
    const actual = Object.getOwnPropertyDescriptor(dataUsed, varActual);
    const formatted = Object.getOwnPropertyDescriptor(dataUsed, varFormatted);
    const p = (event.target as HTMLInputElement);
    if (p !== undefined && p !== null && actual && formatted){
      let occPoint = 0;
      const secondPoint = formatted.value.replace(/\./g, (match: string) => {occPoint += 1; return occPoint === 2 ? '' : match; });
      formatted.value = secondPoint;
      let pNoComma = p.value.replace(/\,/g, '');
      if (pNoComma === ''){
        pNoComma = '0';
      }
      if (!this.re.test(pNoComma) && !this.re2.test(pNoComma)){
        if (formatted?.value !== null){
          p.value = formatted?.value ;
        }else{
          p.value = '0';
        }
        return;
      }
      if (pNoComma === '-'){
        pNoComma = '';
      }

      actual.value = parseFloat((pNoComma === '' ? '0' : pNoComma));


      formatted.value = this.cp.transform(pNoComma, ' ', 'symbol', '0.0-3' );
      if (formatted?.value !== null){
        formatted.value = formatted?.value.replace(' ', '');
      }
      if (pNoComma.charAt(0) === '-' && formatted?.value?.charAt(0) !== '-'){
        formatted.value = '-' + formatted?.value?.trim();
      }
      if (actual?.value === 0){
        p.value = '0';
      }
      if (formatted?.value !== null  ){
        p.value = formatted?.value;
      }
      Object.assign(dataUsed, {[varFormatted]: formatted?.value, [varActual]: actual?.value});

    }
  }

  public formatCurrencyReactiveForm(val: string, form: FormGroup, varActual: string, varFormatted: string): string{
    const actual = form.get(varActual) as FormControl;
    const formatted = form.get(varFormatted) as FormControl;
    let occPoint = 0;
    const secondPoint = formatted.value.replace(/\./g, (match: string) => {occPoint += 1; return occPoint === 2 ? '' : match; });
    formatted.setValue(secondPoint);
    let pNoComma = val.replace(/\,/g, '');
    if (pNoComma === ''){
      pNoComma = '0';
    }
    if (!this.re.test(pNoComma) && !this.re2.test(pNoComma)){
      if (formatted.value !== null){
        val = formatted.value ;
      }else{
        val = '0';
      }
      return val;
    }
    if (pNoComma === '-'){
      pNoComma = '';
    }
    actual.setValue(parseFloat((pNoComma === '' ? '0' : pNoComma)));

    formatted.setValue(this.cp.transform(pNoComma, ' ', 'symbol', '0.0-3' ));
    if (formatted.value !== null){
      formatted.setValue(formatted.value.replace(' ', ''));
    }
    if (pNoComma.charAt(0) === '-' && formatted.value.charAt(0) !== '-'){
      formatted.setValue('-' + formatted.value.trim());
    }
    if (actual.value === 0){
      val = '0';
    }
    if (formatted.value !== null){
      val = formatted.value;
    }
    return val;
  }

  public formatCurrencyReactiveFormFromEvent(event: Event, form: FormGroup, varActual: string, varFormatted: string): void{
    const p = (event.target as HTMLInputElement);
    if (p !== undefined && p !== null){
      p.value = this.formatCurrencyReactiveForm(p.value, form, varActual, varFormatted);
    }
  }
}
