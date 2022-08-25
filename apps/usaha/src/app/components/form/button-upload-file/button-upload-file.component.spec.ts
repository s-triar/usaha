import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonUploadFileComponent } from './button-upload-file.component';

describe('ButtonUploadFileComponent', () => {
  let component: ButtonUploadFileComponent;
  let fixture: ComponentFixture<ButtonUploadFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonUploadFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonUploadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
