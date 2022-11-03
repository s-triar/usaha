import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from "@angular/material/radio";
import { MatButtonModule } from '@angular/material/button';
import { PrintService, UsbDriver, WebPrintDriver } from 'ng-thermal-print';
import { SerialDriver } from '../../../components/utility/additional-ng-thermal-print/SerialDriver';
import { BleDriver } from '../../../components/utility/additional-ng-thermal-print/BleDriver';
import { PopUpNotifService } from '../../../components/pop-up/pop-up-notif/pop-up-notif.service';
import { MatTabsModule } from '@angular/material/tabs';
import { WorkspaceStateService } from '../workspace-state.service';


export const TEST_PRINTER_TEXT = {
  APP: 'Wiranew_usaha.com',
  BANNER: 'Tempat usaha anda berkembang'
} ;
export enum PRINTER_CONNECTION {
  Bluetooth = 'Bluetooth',
  USB= 'USB',
  Network= 'Network'
}
export enum BLUETOOTH_CONNECTION{
  BLE = 'Bluetooth Low Energy',
  Serial = 'Bluetooth Serial'
}
type rr = {
  devices: any,
  server: any,
  services: any,
  char: any,
  error: any
};

@Component({
  selector: 'usaha-setting',
  standalone: true,
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatTabsModule
  ],
})
export class SettingComponent implements OnInit {
  @ViewChild('printerConSelected') printerConSelected!: MatSelect;
  bluetoothTypeSelected!: string;

  connectionStatus = false;
  printerName :string|undefined= '';
  printerConnection = PRINTER_CONNECTION;
  bluetoothConnection = BLUETOOTH_CONNECTION;
  usbPrintDriver!: UsbDriver;
  serialPrintDriver!: SerialDriver;
  blePrintDriver!: BleDriver;

  webPrintDriver!: WebPrintDriver;
  ip = '';
  bleDescription = this.formBuilder.group({
    service: this.formBuilder.nonNullable.control<string|number>('', {validators:[Validators.required]}),
    characteristic: this.formBuilder.nonNullable.control<string|number>('', {validators:[Validators.required]}),
  });

  isSerialAvailable = false;
  isBluetoothAvailable = false;
  isUSBAvailable = false;


  port!: SerialPort;
  writer!: any;
  ble: rr = {
    char: null,
    devices: null,
    server: null,
    services: null,
    error: null
  };


  constructor(
    private formBuilder: FormBuilder,
    private printService: PrintService,
    private notifService: PopUpNotifService,
    private _wsStateService: WorkspaceStateService
    ) {
      if ('serial' in navigator){
        this.isSerialAvailable = true;
      }
      if ('bluetooth' in navigator){
        this.isBluetoothAvailable = true;
      }
      if ('usb' in navigator){
        this.isUSBAvailable = true;
      }
      this.printService.isConnected.subscribe(result => {
          this.connectionStatus = result;
          if (result) {
            console.log('Connected to printer!!!');
          } else {
            console.log('Not connected to printer.');
          }
      });
  }

  ngOnInit(): void {
    this._wsStateService.title$.next('Pengaturan');
  }

  connect(): void{
    if (this.printerConSelected.value === this.printerConnection.Bluetooth){
      if (!this.bluetoothTypeSelected){
        this.notifService.show({message: 'Silahkan pilih jenis bluetooth terlebih dahulu.', title: 'Peringatan!', type: 'warning'});
      }
      else if (this.bluetoothTypeSelected === this.bluetoothConnection.Serial){
        this.requestSerial();
      }else if (this.bluetoothTypeSelected === this.bluetoothConnection.BLE){
        this.requestBLE();
      }
      else{
        this.notifService.show({message: 'Jenis bluetooth tidak dikenal.', title: 'Peringatan!', type: 'warning'});
      }
    }else if (this.printerConSelected.value === this.printerConnection.USB){
      this.requestUsb();
    }else if (this.printerConSelected.value === this.printerConnection.Network){
      // belum ada
      console.log("Network printer is not implemented yet");
      
    }else{
      this.notifService.show({message: 'Silahkan pilih koneksi printer terlebih dahulu.', title: 'Peringatan!', type: 'warning'});
    }
  }
  disconnect(): void{
    this.connectionStatus = false;
    this.printService.setDriver(new UsbDriver(undefined, undefined), undefined);
  }

  requestSerial(): void{
    this.serialPrintDriver = new SerialDriver();
    this.serialPrintDriver.requestPort().subscribe((result: SerialPort) => {
      console.log(result, result.getInfo());
      this.printerName = 'Tidak diketahui';
      this.printService.setDriver(this.serialPrintDriver, 'ESC/POS');
    });
  }

  requestUsb(): void {
    this.usbPrintDriver = new UsbDriver();
    this.usbPrintDriver.requestUsb().subscribe(result => {
      this.printerName = result.productName ?? result.manufacturerName;
      this.printService.setDriver(this.usbPrintDriver, 'ESC/POS');
    });
  }

  connectToWebPrint(): void {
      this.webPrintDriver = new WebPrintDriver(this.ip);
      this.printService.setDriver(this.webPrintDriver, 'WebPRNT');
  }
  requestBLE(): void{
    this.blePrintDriver = new BleDriver();
    const s = this.bleDescription.controls.service.value;
    const c = this.bleDescription.controls.characteristic.value;
    this.blePrintDriver.requestDevice(s, c).subscribe(result => {
      this.printerName = result.name ?? 'Tidak diketahui';
      this.printService.setDriver(this.blePrintDriver, 'ESC/POS');
    });
  }

  private convertDescription(s: string): string|number{
    if (s.includes('-')){
      console.log('- :=>', s);
      return s;
    }else{
      let ss!: any;
      if (s.substring(0, 2).includes('0x')){
        ss = s.substring(2);
        console.log('0x:=>', s, ss);
      }
      else{
        ss = s;
        console.log(':=>', s, ss);
      }
      return parseInt(ss, 16);
    }
  }

  testPrinter(): void {
      this.printService.init()
          .setJustification('center')
          .setBold(true)
          .setSize('large')
          .writeLine(TEST_PRINTER_TEXT.APP)
          .setBold(true)
          .setSize('normal')
          .writeLine(TEST_PRINTER_TEXT.BANNER)
          .setBold(false)
          .feed(4)
          .cut('full')
          .flush();
  }

  objtostr(obj: any): string{
    let a = '';
    console.log(JSON.stringify(obj));
    // tslint:disable-next-line:forin
    for (const key in obj) {
      if (!key.includes('_')){
        // if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const element = obj[key];
        a = a + `<u>${key}</u> : ${element} <br/>`;
        // }
      }
    }
    console.log(a);
    return a;
  }
}
