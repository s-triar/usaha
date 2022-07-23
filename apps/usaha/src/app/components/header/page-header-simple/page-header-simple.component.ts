import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";
import { BackDirective } from '../../../directives/back/back.directive';

@Component({
  selector: 'usaha-page-header-simple',
  standalone: true,
  imports: [
    CommonModule, 
    FlexLayoutModule, 
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    BackDirective
  ],
  templateUrl: './page-header-simple.component.html',
  styleUrls: ['./page-header-simple.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderSimpleComponent implements OnInit {
  @Input()
  title: string | null = null;

  constructor() {}

  ngOnInit(): void {}
}
