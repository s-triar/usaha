import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, find, map } from 'rxjs';
import { PRODUCT_DEFAULT } from 'src/app/application/constant';
import { InfoOfGoodsForUpdatingDto } from 'src/app/domain/backend/Dtos';
import { GoodsTypeService } from 'src/app/infrastructure/backend/goods-type.service';
import { InputCurrencyComponent } from 'src/app/ui/components/form/input-currency/input-currency.component';
// import { GoodsTypeService } from 'src/app/shared/services/goods-type.service';
// import { GoodsTypeDto, InfoOfGoodsForUpdatingDto } from 'src/app/shared/types/Dtos';
// import { PRODUCT_DEFAULT } from 'src/app/shared/values';
import { MemberGroupProductKuDialogComponent } from '../member-group-product-ku-dialog/member-group-product-ku-dialog.component';
// import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';

@UntilDestroy()
@Component({
  selector: 'app-form-info-product-ku',
  templateUrl: './form-info-product-ku.component.html',
  styleUrls: ['./form-info-product-ku.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    InputCurrencyComponent,
    MatCheckboxModule,

  ]
})
export class FormInfoProductKuComponent implements OnInit {
  @Input() idUsaha!: string;
  @Input() dataGoods!: InfoOfGoodsForUpdatingDto;

  @Output() updateInfoClickEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() updatePriceClickEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() addStockClickEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() adjustStockClickEvent: EventEmitter<void> = new EventEmitter<void>();

  // GoodsTypesData!: GoodsTypeDto[];
  GoodsTypesDataShow!: string;

  defaultImg: string = PRODUCT_DEFAULT;
  url: string|null|ArrayBuffer = null;
  urlImg: string|null|ArrayBuffer = null;

  // Selling chart
  

  constructor(
    private dialog: MatDialog,
    private readonly goodsTypeService: GoodsTypeService,
    private readonly snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    console.log(this.dataGoods);
    if (this.dataGoods.photo){
      this.dataGoods.photo = this.dataGoods.photo.replace(/\\/g, '/');
      this.url = this.dataGoods.photo;
      this.urlImg = this.dataGoods.photo;
    }
    console.log(this.url);
    this.goodsTypeService.GoodsTypes$
    .pipe(
      untilDestroyed(this),
      filter(x => x.length > 0),
      map(x => x.find(r => r.id === this.dataGoods.goodsTypeId)),
      filter(x => x !== undefined && x !== null)
    ).subscribe(res => {
      if (res){
        this.GoodsTypesDataShow = res.name;
      }
    });
  }
  copy(fieldLabel: string, val: string): void{
    // console.log(event, event.target.value);
    navigator.clipboard.writeText(val);
    this.snackBar.open(fieldLabel + ' berhasil di salin.', 'Ok', {duration: 1500}).afterDismissed();
  }
  showGroupMemberDialog(id: string): void{
    const temp = this.dataGoods.groups.find(x => x.id === id);
    this.dialog.open(MemberGroupProductKuDialogComponent,
      {
        data: temp && temp.members.length > 0 ? temp.members : [],
        maxWidth: '480px',
        width: '80%',
        disableClose: true
      })
      .afterClosed().subscribe();
  }
  updateInfo(): void{
    this.updateInfoClickEvent.emit();
  }
  updatePrice(): void{
    this.updatePriceClickEvent.emit();
  }
  adjustStock(): void{
    this.adjustStockClickEvent.emit();
  }
  addStock(): void{
    this.addStockClickEvent.emit();
  }
}
