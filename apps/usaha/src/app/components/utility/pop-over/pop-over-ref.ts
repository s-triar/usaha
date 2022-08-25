/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, Subject } from 'rxjs';

import { ComponentType, OverlayRef } from '@angular/cdk/overlay';

import { TemplateRef, Type } from '@angular/core';


// R = Response Data Type, T = Data passed to Modal Type
export class PopOverRef<R = any, T = any> {
  private afterClosedSubject = new Subject<any>();

  constructor(
    private overlayRef: OverlayRef,
    public content: ComponentType<T> | string | TemplateRef<any> | Type<any>
    ) {
      this.overlayRef.backdropClick().subscribe(() => this.close(null));
    }

    public detach(result?: any): void {
      setTimeout(() => {
        this.overlayRef.dispose();
      }, 200);
      this.afterClosedSubject.next(result);
      this.afterClosedSubject.complete();
    }

  /**
   * Closes the overlay. You can optionally provide a result.
   */
  public close(result?: any): void {
    setTimeout(() => {
      this.overlayRef.dispose();
    }, 200);
    this.afterClosedSubject.next(result);
    this.afterClosedSubject.complete();
  }

  /**
   * An Observable that notifies when the overlay has closed
   */
  public afterClosed(): Observable<any> {
    return this.afterClosedSubject.asObservable();
  }
  // afterClosed$ = new Subject<OverlayCloseEvent<R>>();

  // constructor(
  //   public overlay: OverlayRef,
  //   public content: string | TemplateRef<any> | Type<any>,
  //   public data: T // pass data to modal i.e. FormData
  // ) {
  //   overlay.backdropClick().subscribe(() => this._close('backdropClick', null));
  // }

  // close(data?: R) {
  //   this._close('close', data);
  // }

  // private _close(type: 'backdropClick' | 'close', data: any) {
  //   this.overlay.dispose();
  //   this.afterClosed$.next({
  //     type,
  //     data
  //   });

  //   this.afterClosed$.complete();
  // }
}
