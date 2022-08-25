import { Injectable } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FormConversionService {


  constructor() { }


    public camelize(text: string): string {
      text = text.toUpperCase();
      return text.substring(0, 1) + text.substring(1).toLowerCase();
    }

    public convertModelToFormData(model: any, parentKey: string|null, carryFormData: FormData|null): FormData {
        const formData = carryFormData || new FormData();
        let index = 0;
        for (const key in model) {
            if (Object.prototype.hasOwnProperty.call(model, key)) {
                if (model[key] !== null && model[key] !== undefined){
                    let propName = parentKey || key;
                    if (parentKey && this.isObject(model)){
                        propName = parentKey + '.' + key;
                    }
                    if (parentKey && this.isArray(model)) {
                        propName = parentKey + '[' + index + ']';
                    }
                    if (model[key] instanceof File) {
                        formData.append(propName, model[key]);
                    }
                    else if (model[key] instanceof FileList) {
                        for (let j = 0; j < model[key].length; j++) {
                            formData.append(propName + '[' + j + ']', model[key].item(j));
                        }
                    }
                    else if (this.isArray(model[key]) || this.isObject(model[key])) {
                        this.convertModelToFormData(model[key], propName, formData);
                    }
                    else if (typeof model[key] === 'boolean') {
                        formData.append(propName, +model[key] ? '1' : '0');
                    }
                    else{
                        const element = model[key];
                        formData.append(propName, element);
                    }
                }

                index++;
            }
        }
        return formData;
    }
    private isArray(val: any): boolean {
        const toString = ({}).toString;
        return toString.call(val) === '[object Array]';
    }

    private isObject(val: any): boolean {
        return !this.isArray(val) && typeof val === 'object' && !!val;
    }
   convertModelToHttpParams(obj: any): HttpParams {
        return this.addToHttpParams(new HttpParams(), obj, null);
      }

      private addToHttpParams(params: HttpParams, obj: any, prefix: string|null): HttpParams {
        for (const p in obj) {
          if (obj.hasOwnProperty(p)) {
            let k = p;
            if (prefix) {
              if (p.match(/^-{0,1}\d+$/)) {
                k = prefix + '[' + p + ']';
              } else {
                k = prefix + '.' + p;
              }
            }
            const v = obj[p];
            if (v !== null && typeof v === 'object' && !(v instanceof Date)) {
              params = this.addToHttpParams(params, v, k);
            } else if (v !== undefined) {
              if (v instanceof Date) {
                params = params.set(k, (v as Date).toISOString()); // serialize date as you want
              }
              else {
                params = params.set(k, v);
              }

            }
          }
        }
        return params;
      }

}
