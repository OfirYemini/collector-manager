import { HomeComponent } from './home/home.component';
import { ReportsComponent } from './reports/reports.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { PrayersComponent } from './prayers/prayers.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { PrintLayoutComponent } from './print-layout/print-layout.component';
import { InvoiceComponent } from './invoice/invoice.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'prayers', component: PrayersComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'reports', component: ReportsComponent},  
];

@NgModule({
  imports: [RouterModule.forRoot(routes),BrowserAnimationsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
