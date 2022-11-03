import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ZXingScannerComponent, ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'usaha-search-input-barcode',
  standalone: true,
  templateUrl: './search-input-barcode.component.html',
  styleUrls: ['./search-input-barcode.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ZXingScannerModule,
    MatSelectModule,
    MatButtonModule,
    MatOptionModule,
    MatIconModule
  ],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchInputBarcodeComponent),
      multi: true,
    },
  ],
})
export class SearchInputBarcodeComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  @Input() labelName!: string;
  @Input() parentForm!: FormGroup;
  @Input() fieldName!: string;

  // @ViewChild('cameras') cameras!: MatSelect;
  @ViewChild('scanner') scanner!: ZXingScannerComponent;
  @ViewChild('inputFieldBarcode') inputFieldBarcode!: ElementRef;

  value = '';
  changed!: (value: string) => void;
  touched!: () => void;
  isDisabled = false;

  isCompleted = false;
  scannerEnabled = false;
  valueScanned: string | undefined;
  availableDevices: MediaDeviceInfo[] = [];
  deviceCurrent: MediaDeviceInfo | undefined;
  deviceSelected = '';
  hasDevices: boolean | undefined;
  hasPermission: boolean | undefined;
  torchEnabled = false;
  tryHarder = false;

  allowedFormats: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.QR_CODE,
  ];

  constructor() {}
  get formField(): FormControl {
    return this.parentForm?.get(this.fieldName) as FormControl;
  }
  writeValue(obj: string): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.changed = fn;
  }
  registerOnTouched(fn: any): void {
    this.touched = fn;
  }
  onChange(event: Event): void {
    const value: string = (event.target as HTMLInputElement).value;
    this.changed(value);
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // this.vcr = (this.templateScanner as unknown) as ViewContainerRef;
    // console.log(this.templateScanner, 'eeeee', this.inputFieldBarcode);
    // if (this.vcr){

    //   this.vcr.clear();
    // }
    // this.loadScanner();
  }
  
  changeDevice(event: MatSelectChange): void {
    // const p = (event as HTMLSelectElement).value ?? '';
    this.onDeviceSelectChange(event.value);
  }

  camerasFoundHandler(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
    if (this.hasDevices) {
      this.onDeviceSelectChange(this.availableDevices[0].deviceId);
    }
  }

  camerasNotFoundHandler(event: any): void {
    // console.log('camera not found');
    this.hasDevices = false;
  }
  scanSuccessHandler(event: any): void {
    // console.log(event);
    this.valueScanned = event;
  }
  scanErrorHandler(event: any): void {
    // console.log(event);
  }
  scanFailureHandler(event: any): void {
    // console.log(event);
  }
  scanCompleteHandler(event: any): void {
    // console.log(event);
    if (event !== undefined) {
      // this.closeScanner();
      this.isCompleted = true;
      if (this.valueScanned !== undefined) {
        this.parentForm.get(this.fieldName)?.patchValue(this.valueScanned);
        this.parentForm.get(this.fieldName)?.updateValueAndValidity();
      }
    }
    // this.scannerEnabled = false;
    // this.isCompleted = true;
  }
  onDeviceSelectChange(selected: string): void {
    const selectedStr = selected ?? '';
    if (this.deviceSelected === selectedStr) {
      return;
    }
    this.deviceSelected = selectedStr;
    const device = this.availableDevices.find(
      (x) => x.deviceId === this.deviceSelected
    );
    this.deviceCurrent = device || undefined;
  }
  onDeviceChange(device: MediaDeviceInfo): void {
    const selectedStr = device?.deviceId || '';
    if (this.deviceSelected === selectedStr) {
      return;
    }
    this.deviceSelected = selectedStr;
    this.deviceCurrent = device || undefined;
    if (this.deviceCurrent !== undefined) {
      this.openScanner();
    } else {
      this.closeScanner();
    }
  }
  scanAgain(): void {
    this.scannerEnabled = true;
    this.isCompleted = false;
  }
  closeScannerDialog(): void {
    // this.dialogRef.close(this.valueScanned);
  }
  onHasPermission(has: boolean): void {
    this.hasPermission = has;
  }
  openScanner(): void {
    this.scannerEnabled = true;
  }
  toggleScanner(): void {
    const p = this.inputFieldBarcode.nativeElement as HTMLInputElement;
    setTimeout(() => {
      p.blur();
    }, 100);
    if (this.scannerEnabled) {
      this.closeScanner();
    } else {
      this.openScanner();
    }
  }
  closeScanner(): void {
   this.scanner.scanStop();
    this.scannerEnabled = false;
    this.isCompleted = true;
    this.valueScanned = undefined;
  }
}
