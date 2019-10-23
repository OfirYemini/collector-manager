import { HomeComponent } from './home/home.component';
import { ReportsComponent } from './reports/reports.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { UsersComponent } from './users/users.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UsersComponent,canActivate:[AuthGuard] },
  { path: 'transactions', component: TransactionsComponent,canActivate:[AuthGuard] },
  { path: 'reports', component: ReportsComponent,canActivate:[AuthGuard]},  
];

@NgModule({
  imports: [RouterModule.forRoot(routes),BrowserAnimationsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
