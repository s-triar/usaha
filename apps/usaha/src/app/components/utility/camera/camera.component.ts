import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FileConversionService } from '../../../services/file-conversion.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { faCamera } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'usaha-camera',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit, AfterViewInit {
  iconCamera = 'camera';
  @Output() captured: EventEmitter<File[]> = new EventEmitter();

  @ViewChild('video')
  video!: ElementRef;

  @ViewChild('canvas')
  canvas!: ElementRef;

  captures: File[] = [];
  innerWidth!: number;
  innerHeight!: number;
  DEFAULTCanvasHeight = 480;
  DEFAULTCanvasWidth = 640;
  canvasHeight = this.DEFAULTCanvasHeight;
  canvasWidth = this.DEFAULTCanvasWidth;
  orientation = '';
  isCameraReady = false;
  public constructor(
    private breakpointObserver: BreakpointObserver,
    private conversionService: FileConversionService
  ) {

  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    const layoutChanges = this.breakpointObserver.observe([
      '(orientation: portrait)',
      '(orientation: landscape)',
    ]);

    layoutChanges.subscribe(result => {
      console.log(result);
      if (result.breakpoints['(orientation: landscape)']){
        this.orientation = 'landscape';
        this.canvasHeight = this.DEFAULTCanvasHeight;
        this.canvasWidth = this.DEFAULTCanvasWidth;

      }else if (result.breakpoints['(orientation: portrait)']){
        this.orientation = 'portrait';
        this.canvasHeight = this.DEFAULTCanvasHeight;
        this.canvasWidth = this.DEFAULTCanvasWidth;
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onResize(event: any): void {
    this.innerWidth = event.target.innerWidth;
    this.innerHeight = event.target.innerHeight;
  }
  private stopCamera(): void{
    if (this.video.nativeElement.srcObject){
      this.video.nativeElement.pause();
      this.video.nativeElement.srcObject.getTracks().forEach((track: MediaStreamTrack) => {
        try {
          track.enabled = false;
          track.stop();
          this.video.nativeElement.srcObject.removeTrack(track);
        } catch (error) {
          console.log('error stop track of camera', error);
        }
      });
      this.video.nativeElement.srcObject = null;
      this.isCameraReady = false;
    }
    // if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    //   navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    //     stream.getTracks().forEach((track) => {
    //       try {
    //         track.enabled = false;
    //       track.stop();
    //       stream.removeTrack(track);
    //       console.log("stop track");
    //       } catch (error) {
    //         console.log(error, "stop track");

    //       }


    //     });

    //     this.video.nativeElement.pause();
    //     this.video.nativeElement.srcObject = null;
    //     this.isCameraReady = false;
    //     console.log("stop stream");
    //   });
    // }
  }
  public ngAfterViewInit(): void {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
          // this.video.nativeElement.src = window.URL.createObjectURL(stream);
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
          this.isCameraReady = true;
        });
    }
  }

  public capture(): void {
      const context = this.canvas.nativeElement.getContext('2d')
                      .drawImage(this.video.nativeElement, 0, 0, this.canvasWidth, this.canvasHeight);
      const type = 'image/jpeg';
      const filename = `take_photo_from_cam-${this.captures.length}.jpeg`;
      const database64 = this.canvas.nativeElement.toDataURL(type, 0.5);
      const f: File = this.conversionService.ConvertBase64ToFile(database64, filename, type);
      this.captures.push(f);
      this.stopCamera();
      this.captured.emit(this.captures);
  }
}
