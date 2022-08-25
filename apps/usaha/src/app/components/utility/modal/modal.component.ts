import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalRef } from './modal-ref';
import { Event, NavigationStart, Router } from '@angular/router';
import { filter,  take, tap } from 'rxjs';


@Component({
  selector: 'usaha-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],

})
export class ModalComponent implements OnInit {

  contentType!: 'template' | 'string' | 'component';
  // content!: string | TemplateRef<any> | Type<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any;

  constructor(private ref: ModalRef, private router: Router) {
    this.router.events.pipe(
      filter((event: Event) => event instanceof NavigationStart),
      tap(() => this.ref.detach()),
      take(1)
    ).subscribe();
  }

  close(): void {
    this.ref.close(null);
  }

  ngOnInit(): void{
    this.content = this.ref.content;

    if (typeof this.content === 'string') {
      this.contentType = 'string';
    } else if (this.content instanceof TemplateRef) {
      this.contentType = 'template';
      this.context = {
        close: this.ref.close.bind(this.ref)
      };
    } else {
      this.contentType = 'component';
    }
  }

}
