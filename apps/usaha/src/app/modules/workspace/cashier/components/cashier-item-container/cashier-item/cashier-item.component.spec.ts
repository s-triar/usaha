import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierItemComponent } from './cashier-item.component';

describe('CashierItemComponent', () => {
  let component: CashierItemComponent;
  let fixture: ComponentFixture<CashierItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashierItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashierItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
