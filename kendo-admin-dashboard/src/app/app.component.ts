import { Component, OnInit, ViewChild } from '@angular/core';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { employees } from './employees';
import { images } from './images';

@Component({
  selector: 'my-app',
  template: `
    <kendo-grid
      [kendoGridBinding]="gridView"
      kendoGridSelectBy="id"
      [(selectedKeys)]="mySelection"
      [pageSize]="20"
      [pageable]="true"
      [sortable]="true"
      [groupable]="true"
      [reorderable]="true"
      [resizable]="true"
      [height]="500"
      [columnMenu]="{ filter: true }"
    >
      <ng-template kendoGridToolbarTemplate>
        <input [style.width.px]="165" placeholder="Search in all columns..." kendoTextBox (input)="onFilter($event)"/>
        <kendo-grid-spacer></kendo-grid-spacer>
        <button kendoGridExcelCommand type="button" icon="file-excel">Export to Excel</button>
        <button kendoGridPDFCommand icon="file-pdf">Export to PDF</button>
      </ng-template>
      <kendo-grid-checkbox-column
        [width]="45"
        [headerClass]="{'text-center': true}"
        [class]="{'text-center': true}"
        [resizable]="false"
        [columnMenu]="false"
        [showSelectAll]="true"
      ></kendo-grid-checkbox-column>
      <kendo-grid-column-group title="Employee" [columnMenu]="false">
        <kendo-grid-column field="full_name" title="Contact Name" [width]="220">
          <ng-template kendoGridCellTemplate let-dataItem>
            <div class="customer-photo" [ngStyle]="{'background-image' : photoURL(dataItem)}"></div>
            <div class="customer-name">{{ dataItem.full_name }}</div>
          </ng-template>
        </kendo-grid-column>
        <kendo-grid-column field="job_title" title="Job Title" [width]="220">
        </kendo-grid-column>
        <kendo-grid-column
          field="country"
          title="Country"
          [width]="100"
          [class]="{'text-center': true}"
          [resizable]="false"
        >
          <ng-template kendoGridCellTemplate let-dataItem>
            <img class="flag" [src]="flagURL(dataItem)" [width]="30">
          </ng-template>
        </kendo-grid-column>
        <kendo-grid-column
          field="is_online"
          title="Status"
          [width]="100"
          [class]="{'text-center': true}"
          [resizable]="false"
          filter="boolean"
        >
          <ng-template kendoGridCellTemplate let-dataItem>
            <span *ngIf="dataItem.is_online === true" class="badge badge-success">Online</span>
            <span *ngIf="dataItem.is_online === false" class="badge badge-danger">Offline</span>
          </ng-template>
        </kendo-grid-column>
      </kendo-grid-column-group>
      <kendo-grid-column-group title="Performance" [columnMenu]="false">
        <kendo-grid-column
          field="rating"
          title="Rating"
          [width]="110"
          [resizable]="false"
          filter="numeric"
        >
          <ng-template kendoGridCellTemplate let-dataItem>
            <kendo-rating
              [value]="dataItem.rating"
              [max]="5"
            ></kendo-rating>
          </ng-template>
        </kendo-grid-column>
        <kendo-grid-column
          field="target"
          title="Engagement"
          [width]="230"
          [resizable]="false"
          filter="numeric"
        >
          <ng-template kendoGridCellTemplate let-dataItem>
            <kendo-sparkline type="bar"
                             [data]="dataItem.target"
                             [tooltip]="{visible: false}"
                             [transitions]="true"
                             [seriesDefaults]="{labels: {background: 'none', visible: true, format: '{0}%'}}"
            >
              <kendo-chart-area [opacity]="0" [width]="200"></kendo-chart-area>
              <kendo-chart-value-axis>
                <kendo-chart-value-axis-item [min]="0" [max]="130">
                </kendo-chart-value-axis-item>
              </kendo-chart-value-axis>
            </kendo-sparkline>
          </ng-template>
        </kendo-grid-column>
        <kendo-grid-column
          field="budget"
          title="Budget"
          [width]="100"
          filter="numeric"
        >
          <ng-template kendoGridCellTemplate let-dataItem>
            <span [ngClass]="{'red text-bold': dataItem.budget < 0}">{{ dataItem.budget | currency }}</span>
          </ng-template>
        </kendo-grid-column>
      </kendo-grid-column-group>
      <kendo-grid-column-group title="Contacts" [columnMenu]="false">
        <kendo-grid-column field="phone" title="Phone" [width]="130">
        </kendo-grid-column>
        <kendo-grid-column field="address" title="Address" [width]="200">
        </kendo-grid-column>
      </kendo-grid-column-group>

      <kendo-grid-pdf fileName="Employees.pdf" [repeatHeaders]="true"></kendo-grid-pdf>
      <kendo-grid-excel fileName="Employees.xlsx"></kendo-grid-excel>
    </kendo-grid>
  `,
  styles: [`
    .customer-photo {
      display: inline-block;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-size: 32px 35px;
      background-position: center center;
      vertical-align: middle;
      line-height: 32px;
      box-shadow: inset 0 0 1px #999, inset 0 0 10px rgba(0,0,0,.2);
      margin-left: 5px;
    }

    .customer-name {
      display: inline-block;
      vertical-align: middle;
      line-height: 32px;
      padding-left: 10px;
    }

    .red {
      color: #d9534f;
    }

    .text-bold {
      font-weight: 600;
    }
  `]
})
export class AppComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  public gridData: unknown[] = employees;
  public gridView: unknown[];

  public mySelection: string[] = [];

  public ngOnInit(): void {
    this.gridView = this.gridData;
  }

  public onFilter(input: Event): void {
    const inputValue = (input.target as HTMLInputElement).value;

    this.gridView = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'full_name',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'job_title',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'budget',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'phone',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'address',
            operator: 'contains',
            value: inputValue
          }
        ]
      }
    }).data;

    this.dataBinding.skip = 0;
  }

  public photoURL(dataItem: {img_id: string, gender: string}): string {
    const code: string = dataItem.img_id + dataItem.gender;
    const image: {[Key: string]: string} = images;

    return image[code];
  }

  public flagURL(dataItem: {country: string}): string {
    const code: string = dataItem.country;
    const image: {[Key: string]: string} = images;

    return image[code];
  }
}
