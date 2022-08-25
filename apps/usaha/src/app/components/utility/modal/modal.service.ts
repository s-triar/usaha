/* eslint-disable @typescript-eslint/no-explicit-any */
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { Injectable, InjectionToken, Injector, TemplateRef, Type } from '@angular/core';
import { ModalComponent } from './modal.component';
import { ModalRef } from './modal-ref';

export const BR_DIALOG_DATA = new InjectionToken<any>('BR_DIALOG_DATA');
export interface DialogConfig {
  data?: any;
  closeOnBackDropClick: boolean;
}


@Injectable({
  providedIn: 'root',

})
export class ModalService {

  constructor(private overlay: Overlay, private injector: Injector) {}

  open<T>(component: ComponentType<T> | string | TemplateRef<any> | Type<any>, config?: DialogConfig): ModalRef<any, any> {

    // Globally centered position strategy
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();
    // const p: OverlayConfig = {

    // };
    // Create the overlay with customizable options
    const overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: ['overlay-backdrop', 'br-bg-glass'],
      panelClass: ['overlay-panel'],

    });
    // Create dialogRef to return
    const dialogRef = new ModalRef(overlayRef, component);

    // Attach component portal to the overlay
    // const portal = new ComponentPortal(component);
    // overlayRef.attach(portal);

    // Create injector to be able to reference the DialogRef from within the component
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: ModalRef, useValue: dialogRef },
        {provide: BR_DIALOG_DATA, useValue: config?.data},
      ]
    });

    // Attach component portal to the overlay
    const portal = new ComponentPortal(ModalComponent, null, injector);
    setTimeout(() => {
      overlayRef.attach(portal);
    }, 300);

    return dialogRef;
  }
}
