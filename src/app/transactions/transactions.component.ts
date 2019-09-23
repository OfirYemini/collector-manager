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
  users: any[];

  filteredPrayers: Observable<any[]>;
  filteredTransactionsTypes: Observable<string[]>;

  newRow: any;
  displayedColumns = ['id', 'prayerName', 'description', 'amount', 'date', 'action'];
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  addPrayerControl = new FormControl();
  addDescControl = new FormControl();

  constructor(private transactionsService: TransactionsService, private usersService: UsersService, public dialog: MatDialog) { }

  ngOnInit() {
    var from = new Date();
    from.setDate(from.getDate() - 14);
    this.newRow = {};


    const transactions$ = this.transactionsService.getTransactions(from, new Date())
    const users$ = this.usersService.getUsers();

    combineLatest(transactions$, users$, (transactions: any[], users: any[]) => ({ transactions: transactions, users: users }))
      .subscribe(data => {        
        this.users = data.users;
        var prayersFullName = data.users.map(p => p.lastName + ' ' + p.firstName);
        this.filteredPrayers = this.addPrayerControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value, prayersFullName))
          );
          
          data.transactions.forEach(function (obj) {
            let user = data.users.filter(u=>u.id==obj.userId)[0];
            obj.userFullName = user.lastName + ' ' + user.firstName;
          });
          this.transactions = data.transactions;
      })

    // this.transactionsService.getTransactions(from, new Date()).subscribe((data: any[]) => {
    //   console.log(data);
    //   this.transactions = data;
    // });
    this.transactionsService.getTransactionTypes().subscribe((settings: any) => {
      this.transactionsTypes = settings.reduce(function (map, obj) {
        map[obj.id] = obj.name;
        return map;
      }, {});
      this.filteredTransactionsTypes = this.addDescControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value, settings))
        );
    });
    // this.usersService.getUsers().subscribe((data: any[]) => {
    //   console.log(data);
    //   this.users = data;
    //   var prayersFullName = data.map(p => p.lastName + ' ' + p.firstName);
    //   this.filteredPrayers = this.addPrayerControl.valueChanges
    //     .pipe(
    //       startWith(''),
    //       map(value => this._filter(value, prayersFullName))
    //     );
    // });


  }

  private _filter(value: string, fromList: any): string[] {
    const filterValue = value.toLowerCase();

    return fromList.filter(option => (option.name.toLowerCase().includes(filterValue)));
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
