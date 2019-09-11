import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
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
  MatAutocompleteModule,
  MatToolbarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { PrayersComponent } from './prayers/prayers.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { ReportsComponent } from './reports/reports.component';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { UsersService } from './users.service';
import { TransactionsService } from './transactions.service';
import { DataService } from './data.service';
import { HttpClientModule } from '@angular/common/http';
import { PrintLayoutComponent } from './print-layout/print-layout.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { ReportsService } from './reports.service';
@NgModule({
  declarations: [
    AppComponent,
    TransactionsTableComponent, 
    DialogBoxComponent, NavComponent, HomeComponent, PrayersComponent, TransactionsComponent, ReportsComponent, PrintLayoutComponent, InvoiceComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatAutocompleteModule,
    FormsModule,    
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,    
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    InMemoryWebApiModule.forRoot(DataService),
    HttpClientModule,
    AngularFontAwesomeModule
  ],
  entryComponents: [
    DialogBoxComponent
  ],
  providers: [UsersService, TransactionsService,ReportsService],
  bootstrap: [AppComponent]
})
export class AppModule {
  
 }
