import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MainHeaderComponent } from '../../components/header/main-header/main-header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'usaha-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MainHeaderComponent,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
