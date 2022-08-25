import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
  HttpContextToken,
  HttpContext
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
// import { CUSTOM_HEADER } from '../values';
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
// import { PopUpKuNotifService } from 'src/app/components/pop-up-ku/pop-up-ku-notif/pop-up-ku-notif.service';
import { environment } from 'src/environments/environment';
import { PopUpNotifService } from 'src/app/ui/components/pop-up/pop-up-notif/pop-up-notif.service';


const SHOW_ERROR_DIALOG_TOKEN = new HttpContextToken<boolean>(() => false);
export function showErrorDialogContext(): HttpContext {
  return new HttpContext().set(SHOW_ERROR_DIALOG_TOKEN, true);
}

@Injectable()
export class NotificationInterceptor implements HttpInterceptor {

  constructor(private notifService: PopUpNotifService) {}
  private getError(errors:object):string{
    let error ='';
    for (const key in errors) {
      if (Object.prototype.hasOwnProperty.call(errors, key)) {
        const element = errors[key];
        error = element;
        break;
      }
    }
    return error;
  }
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      // tap(
      //   (event: HttpEvent<any>) => {
      //     if (event instanceof HttpResponse) {
      //       if (request.context.get(SHOW_ERROR_DIALOG_TOKEN)) {
      //         this.notifService.show({type: 'success', message: null, title: ''});
      //       }
      //     }
      //   }
      // ),
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse) {
          if (request.context.get(SHOW_ERROR_DIALOG_TOKEN)) {
            console.log(error);
            const msg = environment.production ?
                              'Sesuatu bekerja diluar ekspectasi' :
                              typeof(error.error) === 'string' || error.error === null ? error.message : 
                                  error.error.errors!==undefined ?  this.getError(error.error.errors) :
                                  error.error.detail
                                  // error.error.title + ' => ' + error.message
                                  ;
            this.notifService.show({type: 'error', message: msg, title: 'Error'});
          }
        }
        return throwError(error);
      })
    );
  }
}
