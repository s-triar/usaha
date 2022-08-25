
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, of, throwError } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, first, map, switchMap, take, tap } from 'rxjs/operators';
import { EmployeeService } from 'src/app/infrastructure/backend/employee.service';


export class EmployeeEmailValidator{
    static validate(
        employeeService: EmployeeService
    ): (ctrl: AbstractControl) => Observable<ValidationErrors | null> {
    return (ctrl: AbstractControl) => {
        return ctrl.valueChanges.pipe(
            debounceTime(700),
            // distinctUntilChanged(),
            switchMap(val => employeeService.checkAvailabilityCandidateEmployee({Email: val})),
            map(duplicate => {
                // console.log(duplicate);
                return (!!duplicate && duplicate === true ? { unavailableCandidateEmployeeError: true } : null  );
            }),
            catchError((e) => {
                console.log('error duplicate', e);
                return of( { unavailableCandidateEmployeeError: true });
            }),
            take(1)
        );
        };
    }
}


export function employeeEmailCheck(employeeService: EmployeeService, routes: ActivatedRoute): AsyncValidatorFn |null {
    return (c: AbstractControl): Observable<{ [key: string]: any } | null> => {
        return c.valueChanges.pipe(
            debounceTime(700),
            take(1),
            switchMap(val => employeeService.checkAvailabilityCandidateEmployee({Email: val})),
            map(duplicate => {
                return (!!duplicate && duplicate === true ?  { unavailableCandidateEmployeeError: true } : null );
            }),
            catchError(() => {
                return of({ unavailableCandidateEmployeeError: true });
            })
        );
    };
  }
