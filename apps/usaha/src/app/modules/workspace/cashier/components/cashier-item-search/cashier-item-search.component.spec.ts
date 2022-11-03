import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierItemSearchComponent } from './cashier-item-search.component';

describe('CashierItemSearchComponent', () => {
  let component: CashierItemSearchComponent;
  let fixture: ComponentFixture<CashierItemSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashierItemSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashierItemSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
