import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'usaha-show-case-rating',
  templateUrl: './show-case-rating.component.html',
  styleUrls: ['./show-case-rating.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ]
})
export class ShowCaseRatingComponent implements OnInit {

  @Input() rating = 0;
  stars: number[] = [];
  fullstar = 'star';
  halfstar = 'star_half';
  constructor() { }

  ngOnInit(): void {
    console.log(this.rating);
    const fl = Math.floor(this.rating);
    for (let i = 0; i < fl; i++){
      this.stars.push(1);
    }
    if (this.rating - fl >= 0.5){
      this.stars.push(0.5);
    }
  }

}
