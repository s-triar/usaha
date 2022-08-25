import { AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError, take } from 'rxjs/operators';
import { CashierDataService } from '../../ui/pages/workspace/pages/cashier/services/cashier-data.service';

export class QueueKeyValidator {
    static validate(
      cashierDataService: CashierDataService
    ): (ctrl: AbstractControl) => Observable<{ keyIsReservedError: boolean } | null> {
      return (ctrl: AbstractControl) => {
        return ctrl.valueChanges.pipe(
          debounceTime(700),
          distinctUntilChanged(),
          switchMap(val => of(cashierDataService.checkKey(val))),
          map(available => (available === false ?  null : { keyIsReservedError: true })),
          catchError((e) => of({ keyIsReservedError: true })),
          take(1)
        );
      };
    }
  }
