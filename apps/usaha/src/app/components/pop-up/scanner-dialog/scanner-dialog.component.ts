import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { BarcodeFormat } from '@zxing/browser';
import { ZXingScannerComponent, ZXingScannerModule } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-scanner-dialog',
  templateUrl: './scanner-dialog.component.html',
  styleUrls: ['./scanner-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ZXingScannerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule
  ]
})
export class ScannerDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('scanner', { static: true }) scanner!: ZXingScannerComponent;
  @ViewChild('cameras', { static: true }) cameras!: MatSelect;

  allowedFormats: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.QR_CODE
  ];
  isCompleted = false;
  scannerEnabled = false;
  valueScanned: string|undefined;
  availableDevices!: MediaDeviceInfo[];
  deviceCurrent: MediaDeviceInfo | undefined;
  deviceSelected = '';
  hasDevices: boolean | undefined;
  hasPermission: boolean | undefined;
  torchEnabled = false;
  tryHarder = false;
  constructor(
    private dialogRef: MatDialogRef<ScannerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: BarcodeFormat[] |null
  ) {
    if (this.data !== null){
      this.allowedFormats = this.data;
    }
  }
  // ngAfterViewChecked(): void {
  //   this.cameras.value = this.deviceSelected;

  // }
  ngAfterViewInit(): void {
    this.cameras.value = this.deviceSelected;
  }

  ngOnInit(): void {
  }
  onHasPermission(has: boolean): void{
    this.hasPermission = has;
  }
  openScanner(): void{
    this.scannerEnabled = true;
  }
  closeScanner(): void{
    this.scannerEnabled = false;
  }

  camerasFoundHandler(devices: MediaDeviceInfo[]): void{
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
    if (this.hasDevices){

      this.onDeviceSelectChange(this.availableDevices[0].deviceId);
    }
  }
  camerasNotFoundHandler(event: any): void{
    // console.log('camera not found handler event', event);
    this.hasDevices = false;
  }
  scanSuccessHandler(event: any): void{
    // console.log(event);
    this.valueScanned = event;
  }
  scanErrorHandler(event: any): void{
    // console.log(event);
  }
  scanFailureHandler(event: any): void{
    // console.log(event);
  }
  scanCompleteHandler(event: any): void{
    // console.log(event);
    if (event !== undefined){
      this.closeScanner();
      this.isCompleted = true;
    }
    // this.scannerEnabled = false;
    // this.isCompleted = true;
  }
  onDeviceSelectChange(selected: string): void {
    const selectedStr = selected || '';
    if (this.deviceSelected === selectedStr) { return; }
    this.deviceSelected = selectedStr;
    // console.log(this.availableDevices);
    const device = this.availableDevices.find(x => x.deviceId === selected);
    this.deviceCurrent = device || undefined;
  }

  onDeviceChange(device: MediaDeviceInfo): void {
    const selectedStr = device?.deviceId || '';
    if (this.deviceSelected === selectedStr) { return; }
    this.deviceSelected = selectedStr;
    this.deviceCurrent = device || undefined;
    if (this.deviceCurrent !== undefined){
      this.openScanner();
    }else{
      this.closeScanner();
    }
  }
  scanAgain(): void{
    this.scannerEnabled = true;
    this.isCompleted = false;
  }
  closeScannerDialog(): void{
    this.dialogRef.close(this.valueScanned);
  }
}
