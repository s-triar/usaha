import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OverlayModule, ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
// import {faImage, faFileImage, faCamera} from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ObserversModule } from '@angular/cdk/observers';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { CameraComponent } from '../../utility/camera/camera.component';
import { MatIconModule } from '@angular/material/icon';
import { CustomUploadFileEventChange } from '../../../types';
import { FileConversionService } from '../../../services/file-conversion.service';

@UntilDestroy()
@Component({
  selector: 'usaha-button-upload-file',
  templateUrl: './button-upload-file.component.html',
  styleUrls: ['./button-upload-file.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    OverlayModule,
    ObserversModule,
    MatMenuModule,
    MatIconModule,
    CameraComponent
  ],
  providers: [
    NgxImageCompressService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ButtonUploadFileComponent,
      multi: true
    }
  ],
})
export class ButtonUploadFileComponent implements OnInit, ControlValueAccessor {

  // @Input() labelName!: string;
  // @Input() errors!: {[error: string]: string};
  // @Input() parentForm!: FormGroup;
  // @Input() fieldName!: string;
  iconImage = 'image';
  iconCamera = 'photo_camera';
  iconFileImage = 'folder';
  scrollStrategy!: ScrollStrategy ;
  isOpen = false;
  @ViewChild('img', { read: ElementRef }) imgInput!: ElementRef;
  @Input()
  isMultiple = false;
  @Input()
  disabled = false;
  onChange!: (value: any) => void;
  onTouched!: () => void;
  private file: File | null = null;
  private url: any = null;
  isTakingPicture = false;
  @Output() changed: EventEmitter<CustomUploadFileEventChange> = new EventEmitter();

  isWeb$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Web)
  .pipe(
    untilDestroyed(this),
    map(result => result.matches),
    shareReplay()
  );

  // get formField(): FormControl{
  //   return this.parentForm?.get(this.fieldName) as FormControl;
  // }

  constructor(
    private domSanitizer: DomSanitizer,
    private sso: ScrollStrategyOptions,
    private breakpointObserver: BreakpointObserver,
    private ngxCompress: NgxImageCompressService,
    private utilServicve: FileConversionService
    // private notifDialogService: NotificationDialogService

    // private dialog: MatDialog
    ) {
    this.scrollStrategy = this.sso.close();
  }
  ngOnInit(): void {

  }
  closeMenu(): void{
    this.isOpen = false;
  }

  writeValue(obj: any): void {
    this.url = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onSelectFile(event: Event): void { // called each time file input changes
    const ev: any = (event.target as HTMLInputElement);

    if (ev.files && ev.files[0]) {
      if (!this.isMultiple){
        const file = ev.files[0];
        this.file = file;
        const reader = new FileReader();
        reader.onload = e => {
          if (file.size > 500000){
            const t = (reader.result as string);
            this.ngxCompress.compressFile(t, -1, 50, 50).then(res => {
              this.url = res;
              this.file = this.utilServicve.ConvertBase64ToFile(res, this.file!.name, this.file!.type);
              this.changed.emit({
                file: this.file,
                dataFile: this.url,
                dataFiles: null,
                files: null,
              });
            });
          }
          else{
            this.url = reader.result;
            this.changed.emit({
              file: this.file,
              dataFile: this.url,
              dataFiles: null,
              files: null,
            });
          }

        };

        reader.readAsDataURL(file);
      }

    }
  }
  chooseImg(): void{
    this.closeMenu();
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    this.imgInput.nativeElement.dispatchEvent(event);
  }
  takingPict(): void{
    this.closeMenu();
    this.isTakingPicture = true;
    // const d: TakingPictureDialogData = {
    //   isMulti: false
    // };
    // const config: MatDialogConfig = {
    //   data: d,
    //   height: '100vh',
    //   width: '100vw',
    //   minHeight: '100vh',
    //   minWidth: '100vw',
    //   maxHeight: '100vh',
    //   maxWidth: '100vw'
    // };
    // this.dialog.open(TakingCameraImageDialogComponent, )
    //            .afterClosed().subscribe(pic => console.log(pic));
  }
  captured(event: File[]): void{
    this.isTakingPicture = false;
    const file = event[0];
    this.file = file;
    const reader = new FileReader();
    reader.onload = e => {
      if (typeof(reader.result) === 'string'){
        // const p: SafeUrl = this.domSanitizer.bypassSecurityTrustUrl(reader.result);
        this.url = reader.result;
        this.changed.emit({
          file: this.file,
          dataFile: this.url,
          dataFiles: null,
          files: null,
        });
      }
    };

    reader.readAsDataURL(file);
  }

  cameraCapturingHandle(event: File): void{
    this.isTakingPicture = false;
    const file = event;
    this.file = file;
    const reader = new FileReader();
    reader.onload = e => {
      if (typeof(reader.result) === 'string'){

        // const p: SafeUrl = this.domSanitizer.bypassSecurityTrustUrl(reader.result);
        this.url = reader.result;
        this.changed.emit({
          file: this.file,
          dataFile: this.url,
          dataFiles: null,
          files: null,
        });
      }
    };

    reader.readAsDataURL(file);
  }
  cameraErrorHandle(event: string): void{
    this.isTakingPicture = false;
    // this.notifDialogService.show({message: event, type: 'warning'});
  }

}
