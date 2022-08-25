/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConnectionPositionPair, Overlay } from '@angular/cdk/overlay';
import { ComponentType, ComponentPortal } from '@angular/cdk/portal';
import { ElementRef, Injectable, InjectionToken, Injector, TemplateRef, Type } from '@angular/core';
import { PopOverRef } from './pop-over-ref';
import { PopOverComponent } from './pop-over.component';
export const BR_POP_OVER_DATA = new InjectionToken<any>('BR_POP_OVER_DATA');
@Injectable({
  providedIn: 'root'
})
export class PopOverService {

  constructor(private overlay: Overlay, private injector: Injector) {}

  open<T>( origin: HTMLElement | ElementRef<any>,
           component: ComponentType<T> | string | TemplateRef<any> | Type<any>,
           data: any):
           PopOverRef<any, any> {
    // Globally centered position strategy
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions(this.getPositions())
      .withPush(false);
    // Create the overlay with customizable options
    const overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: ['overlay-backdrop'],
      panelClass: ['overlay-panel'],

    });
    // Create dialogRef to return
    const dialogRef = new PopOverRef(overlayRef, component);

    // Attach component portal to the overlay
    // const portal = new ComponentPortal(component);
    // overlayRef.attach(portal);

    // Create injector to be able to reference the DialogRef from within the component
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: PopOverRef, useValue: dialogRef },
        {provide: BR_POP_OVER_DATA, useValue: data},
      ]
    });

    // Attach component portal to the overlay
    const portal = new ComponentPortal(PopOverComponent, null, injector);
    overlayRef.attach(portal);

    return dialogRef;
  }
  private getPositions(): ConnectionPositionPair[] {
    return [
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top'
      },
      {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
      },
    ];
  }
}
