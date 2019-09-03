import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TransactionsTableComponent } from './transactions-table/transactions-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule,
  MatDialogModule, 
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatToolbarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { PrayersComponent } from './prayers/prayers.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { ReportsComponent } from './reports/reports.component';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { PrayersService } from './prayers.service';
import { DataService } from './data.service';
import { HttpClientModule } from '@angular/common/http'; 

@NgModule({
  declarations: [
    AppComponent,
    TransactionsTableComponent, 
    DialogBoxComponent, NavComponent, HomeComponent, PrayersComponent, TransactionsComponent, ReportsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,    
    MatDialogModule,
    MatFormFieldModule,    
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    InMemoryWebApiModule.forRoot(DataService),
    HttpClientModule
  ],
  entryComponents: [
    DialogBoxComponent
  ],
  providers: [PrayersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
