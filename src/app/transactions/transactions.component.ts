import { UsersService } from './../users.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatSort } from '@angular/material/sort';
import { MatSelect } from '@angular/material/select';

import { TransactionsService } from './../transactions.service';
import { FormControl, FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactions: TransactionRow[];
  transactionsTypes: string[];
  transactionsTypesArr: any;

  users: any[];
  search: { filteredUsers: Observable<any[]>, filteredTransactionsTypes: Observable<any[]> }

  //filteredPrayers: Observable<any[]>;
  filteredTransactionsTypes: Observable<string[]>;

  newRow: any;//{userId: number,typeId: number,amount: number,date: Date};
  displayedColumns = ['id', 'userFullName', 'transactionType', 'amount', 'comment', 'date', 'action'];
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('userNameSelect',{static:false}) userNameinput:MatSelect; 
  dataSource:MatTableDataSource<TransactionRow>;
  addPrayerControl = new FormControl();
  addTransControl = new FormControl();
  action: string;
  updatedTransactionId: number;
  //filteredUsers: any[];
  defaultFrom: Date;
  prevSaturday: Date;
  searchForm: FormGroup;

  constructor(private transactionsService: TransactionsService, private usersService: UsersService, public dialog: MatDialog, private router: Router, private _authService: AuthService, private formBuilder: FormBuilder) {
    if (!this._authService.isAuthenticated()) {
      this.router.navigateByUrl('/login');
    }
    this.defaultFrom = new Date();
    this.defaultFrom.setDate(this.defaultFrom.getDate() - 14);

    this.searchForm = this.formBuilder.group({
      'from': [this.defaultFrom.toISOString().substring(0, 10), Validators.required],
      'to': [new Date().toISOString().substring(0, 10), Validators.required],
      'user': [],
      'typeId': [],
    });

  }
  
  ngOnInit() {
    this.prevSaturday = new Date();
    this.prevSaturday.setDate(this.prevSaturday.getDate() - (this.prevSaturday.getDay() + 3) % 7)
        
    this.newRow = { userId: null, typeId: null, amount: null, date: new Date(this.prevSaturday) };

    this.search = {
      filteredUsers: new Observable<any[]>(),
      filteredTransactionsTypes: new Observable<any[]>()
    };
    
    const transactions$:Observable<any> = this.transactionsService.getTransactionsByDate(this.defaultFrom, new Date());
    const users$:Observable<any> = this.usersService.getUsers();
    const transactionTypes$:Observable<any> = this.transactionsService.getTransactionTypes();

    let _this = this;
    function initTransactionTypes(settings: any) {
      _this.transactionsTypes = settings.reduce(function (map, obj) {
        map[obj.id] = obj.name;
        return map;
      }, {});
      _this.filteredTransactionsTypes = settings;
      _this.transactionsTypesArr = settings;
      //_this.search.transTypes.filteredTransactionsTypes = settings;
    };




    combineLatest([transactions$, users$, transactionTypes$])
      .pipe(
        map(([transactions, users, settings]) => ({ transactions, users, settings }))
      )
      .subscribe(data => {
        initTransactionTypes(data.settings.transTypes);

        data.users.forEach((u) => {
          u.fullName = u.lastName + ' ' + u.firstName;
        });
        this.users = data.users;

        this.addPrayerControl.setValue(this.newRow.userName);
        this.newRow.filteredUsers = data.users;
        //this.search.user.filteredUsers = data.users;
        this.search.filteredUsers = this.searchForm.get('user').valueChanges
          .pipe(
            startWith(''),
            map(value => this._filterUsers(value))
          );
        this.transactions = this.initTransactions(data.transactions);
        
        this.dataSource = new MatTableDataSource<TransactionRow>(this.transactions);        
        this.dataSource.sort = this.sort;

        this.search.filteredTransactionsTypes = this.searchForm.get('typeId').valueChanges
          .pipe(
            startWith(''),
            map(value => this._filterTransactionsTypes(value))
          );
      })
  }

  displayUser = (userId:number) =>{
    if(userId==null) return '';
    return this.users.filter(u=>u.id==userId)[0].fullName;
  }
  displayTransType = (transId:number)=>{
    if(!transId) return '';
    return this.transactionsTypes[transId];
  }
  private _filterUsers (value: string): string[] {    
    return this.users.filter(u => u.fullName.includes(value));
  }

  private _filterTransactionsTypes (value: string): string[] {    

    return this.transactionsTypesArr.filter(u => u.name.includes(value));
  }

  set newRowDate(e) {
    e = e.split('-');
    let d = new Date(Date.UTC(e[0], e[1] - 1, e[2]));
    this.newRow.date.setFullYear(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  }

  get newRowDate() {
    return this.newRow.date.toISOString().substring(0, 10);
  }
  private initTransactions(transactions: any[]): TransactionRow[] {
    let _this = this;
    transactions.forEach(function (obj) {
      let user = _this.users.filter(u => u.id == obj.userId)[0];
      obj.userFullName = user.lastName + ' ' + user.firstName;
      obj.filteredUsers = _this.users;
    });
    return transactions.sort((a,b)=>a.id-b.id);
  }


  searchTransactions(searchParams:any) {    
    searchParams.from = new Date(searchParams.from);
    searchParams.to = new Date(searchParams.to);
    console.log(JSON.stringify(searchParams));
    this.transactionsService.searchTransactions(searchParams).subscribe((transactions: any[]) => {
      this.transactions = this.initTransactions(transactions);
      this.dataSource.data = this.transactions;
      this.table.renderRows();
    });
  }
  getTransactions() {
    this.transactionsService.getTransactionsByDate(this.defaultFrom, new Date()).subscribe((transactions: any[]) => {
      this.transactions = this.initTransactions(transactions);
      this.dataSource.data = this.transactions;
      this.table.renderRows();
    });
  }
  filterTransactions(val, obj) {
    if (obj === undefined) {
      this.filteredTransactionsTypes = this.transactionsTypesArr.filter((t) => t.name.indexOf(val) > -1);
    } else {
      obj.filteredTransactionsTypes = this.transactionsTypesArr.filter((t) => t.name.indexOf(val) > -1);
    }

  }
  filterUsers(val: string, row: any) {
    console.log('filterUsers ', val, row);
    row.filteredUsers = this.users.filter(u => u.fullName.indexOf(val) > -1);
  }
  setAction(action, obj) {
    this.action = action;
    this.updatedTransactionId = obj.id;
  }
  addTransaction() {        
    delete this.newRow.filteredUsers;
    this.transactionsService.addTransactions([this.newRow]).subscribe((data: any) => {
      this.getTransactions();
      this.action = null;
      this.updatedTransactionId = null;
      this.newRow = { filteredUsers: this.users, date: new Date(this.prevSaturday) };
      this.userNameinput.focus();  
    }, err => console.log('error adding transaction', err));
  }
  saveTransaction(trans: any) {
    console.log(trans);

    this.transactionsService.updateTransaction(trans.id, {
      userId: trans.userId,
      typeId: trans.typeId,
      comment: trans.comment,
      amount: trans.amount,
      date: trans.date
    }).subscribe((data: any) => {
      this.transactionsService.getTransaction(trans.id).subscribe((updatedTrans: any) => {
        const transIndex = this.transactions.map(t => t.id).indexOf(trans.id);

        updatedTrans = this.initTransactions([updatedTrans])[0];
        this.transactions[transIndex].userFullName = updatedTrans.userFullName;//todo: remove & resolve this
        this.transactions[transIndex] = updatedTrans;

        this.action = null;
        this.updatedTransactionId = null;
      });
    }, err => console.log('error saving user', err));
  }

  onDeleteClick(transId: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '200px',
      data: "האם אתה בטוח?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTransaction(transId);
      }
    });
  }

  deleteTransaction(transId: number) {
    this.transactionsService.deleteTransaction(transId).subscribe(() => {
      var ids = this.transactions.map(t => t.id).filter(id => id !== transId);
      this.transactionsService.getTransactionsByIds(ids).subscribe((transactions: any[]) => {
        this.transactions = this.initTransactions(transactions);
        this.dataSource.data = this.transactions;
        this.table.renderRows();
        this.action = null;
        this.updatedTransactionId = null;
      });
    }, err => console.log('error removing user', err));
  }



}
export interface TransactionRow {
  id:number,
  userFullName: string,
  transactionType: string,
  comment: string,
  amount: number,
  date:Date
}