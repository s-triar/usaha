import { AbstractControl } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, switchMap, of, map, catchError, take } from 'rxjs';
import { CashierDataService } from '../../cashier-data.service';

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