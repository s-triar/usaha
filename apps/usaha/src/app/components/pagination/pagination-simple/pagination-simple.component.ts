import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'usaha-pagination-simple',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination-simple.component.html',
  styleUrls: ['./pagination-simple.component.css'],
})
export class PaginationSimpleComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
