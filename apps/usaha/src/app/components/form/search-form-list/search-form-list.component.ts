import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'usaha-search-form-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './search-form-list.component.html',
  styleUrls: ['./search-form-list.component.css'],
})
export class SearchFormListComponent implements OnInit {
  @Output() searchValue: EventEmitter<string> = new EventEmitter<string>();

  form: FormGroup<{search:FormControl<string>}> = this.fb.group({
    search: this.fb.nonNullable.control('')
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.controls.search.valueChanges
    .subscribe(x=>{
        this.searchValue.emit(x);
      });
  }

  clearInput():void{
    this.form.reset();
    this.form.updateValueAndValidity();
  }
}
