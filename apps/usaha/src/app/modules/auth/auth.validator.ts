import {
    AbstractControl,
    AsyncValidatorFn,
    ValidationErrors,
    ValidatorFn,
  } from '@angular/forms';
  import { Observable, of } from 'rxjs';
  import { debounceTime, map, switchMap, take } from 'rxjs/operators';
import { UserService } from '../../services/user.service';

  
  export class AuthValidator {
    static checkEmailValidator(userService: UserService): AsyncValidatorFn {
      return (control: AbstractControl): Observable<ValidationErrors|null> => {
        return control.valueChanges.pipe(
          debounceTime(500),
          // distinctUntilChanged(),
          switchMap(x=>userService
            .checkEmailExist(x)),
          map((result: boolean) =>
            result ? { emailAlreadyExists: true } : null
          ),
          take(1)
        );
      };
    }
    static checkUsernameValidator(userService: UserService): AsyncValidatorFn {
      return (control: AbstractControl): Observable<ValidationErrors|null> => {
        return control.valueChanges.pipe(
          debounceTime(500),
          // distinctUntilChanged(),
          switchMap(x=>userService
            .checkUsernameExist(x)),
          map((result: boolean) =>
            result ? { usernameAlreadyExists: true } : null
          ),
          take(1)
        );
      };
    }
    static checkConfirmPasswordValidator(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors|null => {
          const password = control.get('password');
          const confirmPassword = control.get('confirmPassword');
          return password?.value === confirmPassword?.value ? null : { passwordNotMatch: true };
      };
    }
  }