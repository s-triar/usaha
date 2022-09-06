import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthViewStateService } from '../auth-view-state.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BackService } from '../../../directives/back/back.service';
import { AuthService } from '../../../services/auth.service';
import { LoginUserDto } from '@usaha/api-interfaces';
import { AuthStateService } from '../../../services/auth-state.service';

@Component({
  selector: 'usaha-login',
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
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup = this._fb.nonNullable.group(
    {
      identifier: this._fb.nonNullable.control('', {
        validators: [Validators.required,Validators.maxLength(255)],
      }),
      password: this._fb.nonNullable.control('', {
        validators: [Validators.required, Validators.maxLength(12)],
      }),
      
    }
  );
  constructor(
    private _authViewStateService:AuthViewStateService,
    private _fb: FormBuilder,
    private _authUserService: AuthService,
    private _authStateService: AuthStateService,
    private _backService: BackService,
    private _snackBar: MatSnackBar
  ) {

  }

  ngOnInit(): void {
    this._authViewStateService.title.next('Login');
    
  }
  submit(): void {
    if (this.form.valid) {
      const formVal = this.form.value as LoginUserDto;
      this._authUserService.login(formVal).subscribe((x) => {
        if(x!==null){
          this._authStateService.loggedIn(x.access_token)
          this._snackBar.open('Login is succeeded', undefined, {
            duration: 2 * 1000,
          });
          this._backService.back('/', true);
        }else{
          this._snackBar.open('You are not found', undefined, {
            duration: 2 * 1000,
          });
        }
      });
    }
  }
}
