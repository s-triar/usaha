import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationSimpleComponent } from '../../../components/pagination/pagination-simple/pagination-simple.component';

@Component({
  selector: 'usaha-my-stores',
  standalone: true,
  imports: [
    CommonModule,
    PaginationSimpleComponent
  ],
  templateUrl: './my-stores.component.html',
  styleUrls: ['./my-stores.component.css'],
})
export class MyStoresComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
