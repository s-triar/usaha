import { AbstractControl } from '@angular/forms';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, take } from 'rxjs/operators';
import { EnterpriseService } from 'src/app/infrastructure/backend/enterprise.service';


export class EnterpriseCodeAvailabilityValidator {
  static validate(
    enterpriseService: EnterpriseService
  ): (ctrl: AbstractControl) => Observable<{ enterpriseCodeAvailabilityError: boolean } | null> {
    return (ctrl: AbstractControl) => {
      return ctrl.valueChanges.pipe(
        debounceTime(700),
        distinctUntilChanged(),
        switchMap(val => enterpriseService.checkAvailableEnterpriseCode({Code: val})),
        map(available => (!!available && available === true ?  null : { enterpriseCodeAvailabilityError: true })),
        catchError((e) => of({ enterpriseCodeAvailabilityError: true })),
        take(1)
      );
    };
  }
}
