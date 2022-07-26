import { Directive, HostListener, Input } from '@angular/core';
import { BackService } from './back.service';

@Directive({
  selector: '[usahaBack]',
  standalone: true,
  providers: [
    BackService
  ]
})
export class BackDirective {

  @Input() replaceUrl=false;
  @Input() backLink: string|null = null;
  constructor(private navigation: BackService) { }
  @HostListener('click')
  onClick(): void {
    this.navigation.back(this.backLink, this.replaceUrl);
  }

}
