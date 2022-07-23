import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../../../services/auth-state.service';
import { Observable } from 'rxjs';
import { UserDto } from '@usaha/api-interfaces';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'usaha-profile',
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatListModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user$!: Observable<UserDto|null>;
  constructor(
    private _authStateService: AuthStateService
  ) {}

  ngOnInit(): void {
    this.user$ = this._authStateService.getUser();
  }
}
