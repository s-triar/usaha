import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthViewStateService } from './auth-view-state.service';
import { Observable } from 'rxjs';
import { PageHeaderSimpleComponent } from '../../components/header/page-header-simple/page-header-simple.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'usaha-auth',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    PageHeaderSimpleComponent,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  title$!: Observable<string>;
  title='';
  constructor(
    private _authViewStateService: AuthViewStateService,
    private _cdr:ChangeDetectorRef
    ) {}

  ngOnInit(): void {
    // setTimeout(() => {
      // this.title$ = this._authViewStateService.title;
    // }, 50);
    this._authViewStateService.title.subscribe(
      x=>{
        this.title=x;
        this._cdr.detectChanges();
      }
    )
  }
}
