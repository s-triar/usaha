import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierItemContainerComponent } from './cashier-item-container.component';

describe('CashierItemContainerComponent', () => {
  let component: CashierItemContainerComponent;
  let fixture: ComponentFixture<CashierItemContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashierItemContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashierItemContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
