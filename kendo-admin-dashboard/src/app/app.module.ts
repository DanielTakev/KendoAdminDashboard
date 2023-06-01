import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { InputsModule } from '@progress/kendo-angular-inputs';

import { AppComponent } from './components/app.component';

import 'hammerjs';
import {RatingComponent} from "./rating.component";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    GridModule,
    ChartsModule,
    InputsModule,
    PDFModule,
    ExcelModule
  ],
  declarations: [
    AppComponent,
    RatingComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
