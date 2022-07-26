import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFormListComponent } from './search-form-list.component';

describe('SearchFormListComponent', () => {
  let component: SearchFormListComponent;
  let fixture: ComponentFixture<SearchFormListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFormListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
