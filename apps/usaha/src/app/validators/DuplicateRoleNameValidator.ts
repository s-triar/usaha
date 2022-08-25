
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, of, throwError } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, first, map, switchMap, take, tap } from 'rxjs/operators';
import { RoleService } from 'src/app/infrastructure/backend/role.service';

export class DuplicateRoleNameValidator{
    static validate(
        roleService: RoleService,
    ): (ctrl: AbstractControl) => Observable<ValidationErrors | null> {
        return (ctrl: AbstractControl) => {
            return ctrl.valueChanges.pipe(
                debounceTime(700),
                switchMap(val => roleService.checkDuplicateRoleName({Name: val })),
                map(duplicate => {
                    return (!!duplicate && duplicate === true ? { duplicateRoleNameError: true } : null  );
                }),
                catchError((e) => {
                    return of( { duplicateRoleNameError: true });
                }),
                take(1)
            );
        };
    }
}


export function roleNameCheck(roleService: RoleService, routes: ActivatedRoute): AsyncValidatorFn |null {
    return (c: AbstractControl): Observable<{ [key: string]: any } | null> => {
        return c.valueChanges.pipe(
            debounceTime(700),
            take(1),
            switchMap(val => roleService.checkDuplicateRoleName({Name: val})),
            map(duplicate => {
                return (!!duplicate && duplicate === true ?  { duplicateRoleNameError: true } : null );
            }),
            catchError(() => {
                return of({ duplicateRoleNameError: true });
            })
        );
    };
  }
