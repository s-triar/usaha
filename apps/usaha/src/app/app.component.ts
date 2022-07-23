import { Component } from '@angular/core';
import { AuthStateService } from './services/auth-state.service';

@Component({
  selector: 'usaha-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  
})
export class AppComponent {
  constructor(
    private authStateService:AuthStateService
  ){
    this.authStateService.loadMyProfile();
  }
}
