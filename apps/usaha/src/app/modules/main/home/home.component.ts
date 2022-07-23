import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'usaha-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports:[CommonModule]
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
