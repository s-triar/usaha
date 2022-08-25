import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CUSTOM_HEADER } from '../values';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(
    ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.headers.has(CUSTOM_HEADER.showLoading)){

      // this.loadingDialogService.loading();
    }
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (request.headers.has(CUSTOM_HEADER.showLoading)){
          // this.loadingDialogService.unLoading();
        }
      }),
      catchError((error: any) => {
        if (request.headers.has(CUSTOM_HEADER.showLoading)){
          // this.loadingDialogService.unLoading();
        }
        return throwError(error);
      })
    );
  }
}
