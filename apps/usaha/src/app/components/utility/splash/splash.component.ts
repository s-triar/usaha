import { Component, Input, OnInit } from '@angular/core';

export enum SplashAnimationType {
  SlideLeft = 'slide-left',
  SlideRight = 'slide-right',
  FadeOut = 'fade-out'
}

@Component({
  selector: 'usaha-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
  standalone: true
})
export class SplashComponent implements OnInit {

  windowWidth!: string;
  splashTransition!: string;
  opacityChange = 1;
  showSplash = true;

  @Input() animationDuration = 0.5;
  @Input() duration = 3;
  @Input() animationType: SplashAnimationType = SplashAnimationType.SlideLeft;

  ngOnInit(): void {
    setTimeout(() => {
      let transitionStyle = '';
      switch (this.animationType) {
        case SplashAnimationType.SlideLeft:
          this.windowWidth = '-' + window.innerWidth + 'px';
          transitionStyle = 'left ' + this.animationDuration + 's';
          break;
        case SplashAnimationType.SlideRight:
          this.windowWidth = window.innerWidth + 'px';
          transitionStyle = 'left ' + this.animationDuration + 's';
          break;
        case SplashAnimationType.FadeOut:
          transitionStyle = 'opacity ' + this.animationDuration + 's';
          this.opacityChange = 0;
      }

      this.splashTransition = transitionStyle;

      setTimeout(() => {
        this.showSplash = !this.showSplash;
      }, this.animationDuration * 1000);
    }, this.duration * 1000);
  }
}
