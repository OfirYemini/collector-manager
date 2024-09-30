import 'hammerjs';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatTableModule } from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { ReportsComponent } from './reports/reports.component';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { UsersService } from './users.service';
import { TransactionsService } from './transactions.service';
import { DataService } from './data.service';
import { HttpClientModule } from '@angular/common/http';
import { ReportsService } from './reports.service';
import { LoginComponent } from './login/login.component';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { TemplatesComponent } from './templates/templates.component';

@NgModule({
  declarations: [
    AppComponent,    
    NavComponent, 
    HomeComponent, 
    UsersComponent, 
    TransactionsComponent, 
    ReportsComponent, 
    LoginComponent, 
    ConfirmationDialogComponent, TemplatesComponent,      
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatAutocompleteModule,
    FormsModule,    
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,    
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    //InMemoryWebApiModule.forRoot(DataService),
    HttpClientModule,
    MatSnackBarModule,
    AngularFontAwesomeModule
  ],  
  providers: [UsersService, TransactionsService,ReportsService],
  bootstrap: [AppComponent]
})
export class AppModule {
  
 }
