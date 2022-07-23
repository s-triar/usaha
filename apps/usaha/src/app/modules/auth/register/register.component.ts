import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthViewStateService } from '../auth-view-state.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthValidator } from '../auth.validator';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { RegisterUserDto } from '@usaha/api-interfaces';
import { BackService } from '../../../directives/back/back.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'usaha-register',
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  providers: [BackService],
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.css'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup = this._fb.nonNullable.group(
    {
      username: this._fb.nonNullable.control('', {
        validators: [Validators.required, Validators.maxLength(255)],
        asyncValidators: [
          AuthValidator.checkUsernameValidator(this._userService),
        ],
      }),
      email: this._fb.nonNullable.control('', {
        validators: [Validators.required, Validators.email, Validators.maxLength(255)],
        asyncValidators: [AuthValidator.checkEmailValidator(this._userService)],
      }),
      fullname: this._fb.nonNullable.control('', {
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      phone: this._fb.nonNullable.control('', {
        validators: [
          Validators.required,
          Validators.maxLength(13),
          Validators.pattern('[0-9]+'),
        ],
      }),
      password: this._fb.nonNullable.control('', {
        validators: [Validators.required, Validators.maxLength(12)],
      }),
      confirmPassword: this._fb.nonNullable.control('', {
        validators: [Validators.required, Validators.maxLength(12)],
      }),
    },
    {
      updateOn: 'blur',
      validators: [AuthValidator.checkConfirmPasswordValidator()],
    }
  );

  constructor(
    private _authViewStateService: AuthViewStateService,
    private _fb: FormBuilder,
    private _userService: UserService,
    private _authUserService: AuthService,
    private _backService: BackService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this._authViewStateService.title.next('Register');
  }

  submit(): void {
    if (this.form.valid) {
      const formVal = this.form.value as RegisterUserDto;
      this._authUserService.register(formVal).subscribe(() => {
        this._snackBar.open('Register is succeeded', undefined, {
          duration: 2 * 1000,
        });
        this._backService.back('auth/login', false);
      });
    }
  }
}
