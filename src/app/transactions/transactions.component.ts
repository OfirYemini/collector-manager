import { UsersService } from './../users.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTable, MatAutocomplete } from '@angular/material';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { TransactionsService } from './../transactions.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactions: any[];
  transactionsTypes: string[];
  transactionsTypesArr: any;
  users: any[];

  filteredPrayers: Observable<any[]>;
  filteredTransactionsTypes: Observable<string[]>;

  newRow: any;
  displayedColumns = ['id', 'userName', 'transactionType', 'amount', 'date', 'action'];
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  addPrayerControl = new FormControl();
  addTransControl = new FormControl();
  action: string;
  updatedTransactionId: number;
  filteredUsers: any[];
  

  constructor(private transactionsService: TransactionsService, private usersService: UsersService, public dialog: MatDialog) { }

  ngOnInit() {
    var from = new Date();
    from.setDate(from.getDate() - 14);
    this.newRow = {};


    const transactions$ = this.transactionsService.getTransactions(from, new Date());
    const users$ = this.usersService.getUsers();
    const transactionTypes$ = this.transactionsService.getTransactionTypes();

    let _this = this;
    function initTransactionTypes(settings: any) {
      _this.transactionsTypes = settings.reduce(function (map, obj) {
        map[obj.id] = obj.name;
        return map;
      }, {});
      _this.filteredTransactionsTypes = settings;
      _this.transactionsTypesArr = settings;      
    };


    

    combineLatest(transactions$, users$, transactionTypes$, (transactions: any[], users: any[], settings: any) => ({ transactions: transactions, users: users, settings: settings }))
      .subscribe(data => {
        initTransactionTypes(data.settings);
        data.users.forEach(u => u.fullName = u.lastName + ' ' + u.firstName);
        this.users = data.users;
        this.filteredUsers = data.users;
        var prayersFullName = data.users.map(p => p.lastName + ' ' + p.firstName);
        this.addPrayerControl.setValue(this.newRow.userName);
        
        data.transactions.forEach(function (obj) {
          let user = data.users.filter(u => u.id == obj.userId)[0];
          obj.userFullName = user.lastName + ' ' + user.firstName;
        });
        this.transactions = data.transactions;
      })
  }
  
  filterTransactions(val) {      
    this.filteredTransactionsTypes = this.transactionsTypesArr.filter((t) => t.name.indexOf(val) > -1);
  }
  filterUsers(val: string) {    
    this.filteredUsers = this.users.filter(u => u.fullName.indexOf(val) > -1);
  }
  setAction(action, obj) {
    this.action = action;
    this.updatedTransactionId = obj.id;
  }
  addTransaction() {
    console.log(this.newRow);
    // this.usersService.addUser(this.newRow).subscribe((data : any)=>{
    //   this.refreshUsers();
    //   this.action = null;
    //   this.updatedUserId = null;
    //   this.newRow = {};
    // },err=>console.log('error adding user',err));
  }
  saveTransaction(row) {
    console.log(row);
    // this.usersService.updateUser(row.id,{
    //   firstName:row.firstName,
    //   lastName:row.lastName,
    //   email:row.email,
    //   isGuest:row.isGuest
    // }).subscribe((data : any)=>{
    //   this.refreshUsers();
    //   this.action = null;
    //   this.updatedUserId = null;
    // },err=>console.log('error saving user',err));
  }
  deleteTransaction(transId: number) {
    // this.usersService.deleteUser(userId).subscribe(()=>{
    //   this.refreshUsers();
    //   this.action = null;
    //   this.updatedUserId = null;
    // },err=>console.log('error removing user',err));
  }
  


  openDialog(action, obj) {
    obj.action = action;
    obj.dialogType = 'transaction';
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update') {
        this.updateRowData(result.data);
      } else {
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData() {
    this.transactionsService.addTransaction(this.newRow).subscribe((newTransId: any) => {
      this.transactionsService.getTransaction(newTransId.id).subscribe((data: any) => {
        this.transactions.push(data);
        this.newRow = {};
        this.table.renderRows();
      })
    })
  }

  updateRowData(trans: any) {
    this.transactionsService.updateTransaction(trans).subscribe((row) => {
      this.transactionsService.getTransaction(trans.id).subscribe((data: any) => {
        this.transactions = this.transactions.filter((value, key) => {
          if (value.id == data.id) {
            value.prayerName = this.users.filter(u => u.id == data.userId);
            value.date = data.date;
            value.amount = data.amount;
            value.description = data.description;
          }
          return true;
        });
        this.table.renderRows();
      })
    })

  }

  deleteRowData(trans: any) {
    this.transactionsService.deleteTransaction(trans.id).subscribe((data) => {
      this.transactions = this.transactions.filter((value, key) => {
        return value.id != trans.id;
      });
    })

  }
}
