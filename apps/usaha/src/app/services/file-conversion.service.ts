import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileConversionService {

  constructor() { }
  public ConvertBase64ToFile(dataBase64: string, filename: string, type: string, pureBase64: boolean = false): File{
    const blb = this.dataURItoBlob(dataBase64, type, pureBase64);
    const f: File = new File([blb], filename, {type, endings: 'native'});
    return f;
}

public dataURItoBlob(dataURI: string, type: string, pureBase64: boolean = false): Blob {
    const data = pureBase64 ? dataURI : dataURI.split('base64,')[1];
    const byteString = atob(data);
    // const byteString = Buffer.from(dataURI, 'base64');
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const cf: BlobPropertyBag = {
      endings: 'native',
      type
    };
    const blob = new Blob([ab], cf); // or mimeString if you want
    return blob;
}
}
