import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthViewStateService } from '../auth-view-state.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'usaha-renew-password',
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
  templateUrl: './renew-password.component.html',
  styleUrls: ['../auth.component.css'],
})
export class RenewPasswordComponent implements OnInit {
  constructor(
    private _authViewStateService:AuthViewStateService,
  ) {

  }

  ngOnInit(): void {
    this._authViewStateService.title.next('Renew Password');
    
  }
}
