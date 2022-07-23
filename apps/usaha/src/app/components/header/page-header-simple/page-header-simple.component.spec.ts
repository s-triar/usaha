import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHeaderSimpleComponent } from './page-header-simple.component';

describe('PageHeaderSimpleComponent', () => {
  let component: PageHeaderSimpleComponent;
  let fixture: ComponentFixture<PageHeaderSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderSimpleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeaderSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
