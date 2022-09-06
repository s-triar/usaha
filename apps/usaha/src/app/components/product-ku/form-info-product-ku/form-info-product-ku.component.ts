import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProductInfoDto, ProductInfoInDto, ProductInfoPriceDto } from '@usaha/api-interfaces';
import { environment } from 'apps/usaha/src/environments/environment.prod';
import { filter, map, tap } from 'rxjs';
import { PRODUCT_DEFAULT } from '../../../constants';
import { ProductTypeService } from '../../../services/product-type.service';
import { InputCurrencyComponent } from '../../form/input-currency/input-currency.component';
// import { GoodsTypeService } from 'src/app/shared/services/goods-type.service';
// import { GoodsTypeDto, InfoOfGoodsForUpdatingDto } from 'src/app/shared/types/Dtos';
// import { PRODUCT_DEFAULT } from 'src/app/shared/values';
import { MemberGroupProductKuDialogComponent } from '../member-group-product-ku-dialog/member-group-product-ku-dialog.component';
// import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import {default as Annotation} from 'chartjs-plugin-annotation';
import { NgChartsModule } from 'ng2-charts';
import { CurrencyConversionService } from '../../../services/currency-conversion.service';

@UntilDestroy()
@Component({ 
  selector: 'usaha-form-info-product-ku',
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
    MatSnackBarModule,
    NgChartsModule
  ],
  providers:[CurrencyPipe, CurrencyConversionService],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class FormInfoProductKuComponent implements OnInit {
  @Input() idUsaha!: string;
  @Input() dataGoods!: ProductInfoDto;

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
  priceLineData!: ChartConfiguration['data']; 
  priceChartOption!: ChartConfiguration['options'];
  lastPrice!: ProductInfoPriceDto;

  stockLineData!: ChartConfiguration['data']; 
  stockChartOption!: ChartConfiguration['options'];
  lastStock!: ProductInfoInDto;

  constructor(
    private dialog: MatDialog,
    private readonly goodsTypeService: ProductTypeService,
    private readonly snackBar: MatSnackBar
  ) { 
    Chart.register(Annotation);
  }

  constructStockLine():void{
    this.stockLineData = {
      datasets:[
        {
          data: this.dataGoods.product_ins.map(x=>x.n),
          label: 'Stock',
          backgroundColor: 'rgba(148,159,177,0.2)',
          borderColor: 'rgba(148,159,177,1)',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          fill: 'origin',
        },
        {
          data: this.dataGoods.product_ins.map(x=>x.price),
          label: 'Harga Beli',
          backgroundColor: 'rgba(148,159,177,0.2)',
          borderColor: 'rgba(148,159,177,1)',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          fill: 'origin',
        },
      ],
      labels:this.dataGoods.product_ins.map((x,i)=>i)
    }
    this.stockChartOption = {
      elements: {
        line: {
          tension: 0.5
        }
      },
      scales: {
        // We use this empty structure as a placeholder for dynamic theming.
        x: {},
        'y-axis-0':
          {
            position: 'left',
          },
        'y-axis-1': {
          position: 'right',
          grid: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            color: 'red'
          }
        }
      },
  
      plugins: {
        legend: { display: true },
      }
    };

    this.lastStock = this.dataGoods.product_ins[this.dataGoods.product_ins.length-1];

  }

  constructPriceLine():void{

    this.priceLineData= {
      datasets: [
        {
          data: this.dataGoods.prices.map(x=>x.price),
          label: 'Harga',
          backgroundColor: 'rgba(148,159,177,0.2)',
          borderColor: 'rgba(148,159,177,1)',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          fill: 'origin',
        },
        {
          data: this.dataGoods.prices.map(x=>x.wholesale_price),
          label: 'Harga Untuk Tengkulak',
          backgroundColor: 'rgba(148,159,177,0.2)',
          borderColor: 'rgba(148,159,177,1)',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          fill: 'origin',
        },
      ],
      labels:this.dataGoods.prices.map((x,i)=>i)
    };

    this.priceChartOption = {
      elements: {
        line: {
          tension: 0.5
        }
      },
      scales: {
        // We use this empty structure as a placeholder for dynamic theming.
        x: {},
        'y-axis-0':
          {
            position: 'left',
          },
        'y-axis-1': {
          position: 'right',
          grid: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            color: 'red'
          }
        }
      },
  
      plugins: {
        legend: { display: true },
      }
    };

    this.lastPrice = this.dataGoods.prices[this.dataGoods.prices.length-1];


  }

  ngOnInit(): void {
    
    if (this.dataGoods.photos.length>0){
      // this.dataGoods.photo = this.dataGoods.photo.replace(/\\/g, '/');
      this.url = environment.backend+'/uploads/product/'+this.dataGoods.photos[this.dataGoods.photos.length-1].url;
      this.urlImg = environment.backend+'/uploads/product/'+this.dataGoods.photos[this.dataGoods.photos.length-1].url;
    }
    console.log(this.url);
    this.goodsTypeService.getAllProductType()
    .pipe(
      tap(x=>console.log(x)),
      untilDestroyed(this),
      filter(x => x.length > 0),
      map(x => x.find(r => r.id === this.dataGoods.product_type_id)),
      filter(x => x !== undefined && x !== null)
    ).subscribe(res => {
      if (res){
        this.GoodsTypesDataShow = res.name;
      }
    });
    this.constructPriceLine();
    this.constructStockLine();
  }
  copy(fieldLabel: string, val: string): void{
    // console.log(event, event.target.value);
    navigator.clipboard.writeText(val);
    this.snackBar.open(fieldLabel + ' berhasil di salin.', 'Ok', {duration: 1500}).afterDismissed();
  }
  showGroupMemberDialog(id: string): void{
    // const temp = this.dataGoods.groups.find(x => x.id === id);
    this.dialog.open(MemberGroupProductKuDialogComponent,
      {
        // data: temp && temp.members.length > 0 ? temp.members : [],
        data: id,
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
