import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { debounceTime, map, Observable, switchMap, take } from 'rxjs';
import { ShopService } from '../../../services/shop.service';


export class AddMyStoreValidator{
    static checkDuplicateShopCode(shopService:ShopService): AsyncValidatorFn{
        return (control:AbstractControl):Observable<ValidationErrors|null> => {
            return control.valueChanges.pipe(
                debounceTime(500),
                switchMap(x=>shopService.checkDuplicateShopCode(x)),
                map((result:boolean)=> result ? {shopCodeAlreadyExist:true}:null),
                take(1)
            );
        };
    }
}