import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'usaha-info-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-product.component.html',
  styleUrls: ['./info-product.component.scss'],
})
export class InfoProductComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
