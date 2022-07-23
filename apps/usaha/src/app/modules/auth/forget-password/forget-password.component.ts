import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthViewStateService } from '../auth-view-state.service';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'usaha-forget-password',
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './forget-password.component.html',
  styleUrls: ['../auth.component.css'],
})
export class ForgetPasswordComponent implements OnInit {
  constructor(
    private _authViewStateService:AuthViewStateService
  ) {

  }

  ngOnInit(): void {
    this._authViewStateService.title.next('Forget Password');
  }
}
