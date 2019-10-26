import { UsersService } from './../users.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTable, MatDatepicker, MatAutocomplete } from '@angular/material';
import { TransactionsService } from './../transactions.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactions: any[];
  transactionsTypes: string[];
  templates: any[];
  filteredTemplatesArr:any[];
  templatesArr:any[]= [];
  transactionsTypesArr: any;
  templateDateCtl:FormControl;
  receiptInitNumberCtl:FormControl =new FormControl();
  
  users: any[];
  currentTemplate:any[];

  filteredPrayers: Observable<any[]>;
  filteredTransactionsTypes: Observable<string[]>;

  newRow: any;//{userId: number,typeId: number,amount: number,date: Date};
  displayedColumns = ['id', 'userName', 'transactionType', 'amount','comment', 'date', 'action'];
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(NgForm, { static: true }) templateForm: NgForm;
  

  addPrayerControl = new FormControl();
  addTransControl = new FormControl();
  action: string;
  updatedTransactionId: number;
  //filteredUsers: any[];
  defaultFrom: Date;
  isReceiptInputVisible: boolean = false;
  
  constructor(private transactionsService: TransactionsService, private usersService: UsersService, public dialog: MatDialog,private router: Router,private _authService:AuthService) { 
    if (!this._authService.isAuthenticated()) {
      this.router.navigateByUrl('/login');
    }
  }

  ngOnInit() {
    
    this.defaultFrom = new Date();
    this.defaultFrom.setDate(this.defaultFrom.getDate() - 14);
    this.newRow={userId:null,typeId:null,amount:null,date:new Date()};   

    var prevSaturday = new Date();
    prevSaturday.setDate(prevSaturday.getDate() - (prevSaturday.getDay()+3) % 7)
    this.templateDateCtl = new FormControl(new Date(prevSaturday));
    
    const transactions$ = this.transactionsService.getTransactionsByDate(this.defaultFrom,new Date());
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
        initTransactionTypes(data.settings.transTypes);
        this.templates = data.settings.templates;
        Object.keys(data.settings.templates).forEach(templateId => {          
          this.templatesArr.push({id:templateId,name:data.settings.templates[templateId].name});          
        });
        this.filteredTemplatesArr = this.templatesArr;
        data.users.forEach((u) => {
          u.fullName = u.lastName + ' ' + u.firstName;          
        });
        this.users = data.users;
        this.onTemplateChanged(1);        
                
        this.addPrayerControl.setValue(this.newRow.userName);
        this.newRow.filteredUsers = data.users;
        this.transactions = this.initTransactions(data.transactions);
      })
  }


  set newRowDate(e){
    e = e.split('-');
    let d = new Date(Date.UTC(e[0], e[1]-1, e[2]));
    this.newRow.date.setFullYear(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  }

  get newRowDate(){
    return this.newRow.date.toISOString().substring(0, 10);
  }
  private initTransactions(transactions: any[]):any[] {
    let _this = this;
    transactions.forEach(function (obj) {
      let user = _this.users.filter(u => u.id == obj.userId)[0];
      obj.userFullName = user.lastName + ' ' + user.firstName;
      obj.filteredUsers = _this.users;
    });
    return transactions;
  }

  onReceiptInitNumber(){
    this.receiptInitNumberCtl.value

    this.currentTemplate.forEach((row,index) => {
      var number = +(this.receiptInitNumberCtl.value) + index;
      row.comment = `קבלה ${number}`
    });
  }

  getTransactions() {    
    this.transactionsService.getTransactionsByDate(this.defaultFrom,new Date()).subscribe((transactions : any[])=>{      
      this.transactions = this.initTransactions(transactions);      
    });
  }
  filterTransactions(val) {      
    this.filteredTransactionsTypes = this.transactionsTypesArr.filter((t) => t.name.indexOf(val) > -1);
  }
  filterUsers(val: string,row:any) {    
    console.log('filterUsers ', val, row);    
    row.filteredUsers = this.users.filter(u => u.fullName.indexOf(val) > -1);    
  }
  setAction(action, obj) {
    this.action = action;
    this.updatedTransactionId = obj.id;
  }
  addTransaction() {
    delete this.newRow.filteredUsers;
    this.transactionsService.addTransactions([this.newRow]).subscribe((data : any)=>{
      this.getTransactions();
      this.action = null;
      this.updatedTransactionId = null;
      this.newRow = {filteredUsers:this.users,date:new Date()};
    },err=>console.log('error adding transaction',err));
  }
  saveTransaction(trans:any) {
    console.log(trans);    

    this.transactionsService.updateTransaction(trans.id,{
      userId: trans.userId,
      typeId: trans.typeId,
      comment:trans.comment,
      amount:trans.amount,
      date: trans.date
    }).subscribe((data : any)=>{
      this.transactionsService.getTransaction(trans.id).subscribe((updatedTrans : any)=>{        
        const transIndex = this.transactions.map(t => t.id).indexOf(trans.id);
        
        updatedTrans = this.initTransactions([updatedTrans])[0];
        this.transactions[transIndex].userFullName= updatedTrans.userFullName;//todo: remove & resolve this
        this.transactions[transIndex] = updatedTrans;
        
        this.action = null;
        this.updatedTransactionId = null;
      });
    },err=>console.log('error saving user',err));
  }

  onDeleteClick(transId:number){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '200px',
      data: "האם אתה בטוח?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.deleteTransaction(transId);
      }
    });
  }

  deleteTransaction(transId: number) {    
    this.transactionsService.deleteTransaction(transId).subscribe(()=>{
      var ids = this.transactions.map(t=>t.id).filter(id=>id!==transId);
      this.transactionsService.getTransactionsByIds(ids).subscribe((transactions : any[])=>{
        this.transactions = this.initTransactions(transactions);      
        this.action = null;
        this.updatedTransactionId = null;
      });
    },err=>console.log('error removing user',err));
  }
  
  filterTemplates(val) {      
    this.filteredTemplatesArr = this.templatesArr.filter((t) => t.name.indexOf(val) > -1);
  }
  onTemplateChanged(templateId:number){
    console.log('template ', templateId);    
    this.isReceiptInputVisible = this.templates[templateId].name=="קבלה"; 
    this.currentTemplate = [];
    this.templates[templateId].trans_type_ids.forEach(transTypeId => {
      this.currentTemplate.push({
        typeId:transTypeId,
        date:this.templateDateCtl.value,
        filteredUsers:this.users
      });
    });
  }
  addTransactions() {    
    if (this.templateForm.valid) {
      var transactionsToAdd = [];
      let _this = this;
      let date = new Date(this.templateDateCtl.value.toDateString());
      this.currentTemplate.forEach(function(v){ 
        v.filteredUsers = _this.users;
        transactionsToAdd.push({
          userId:v.userId,
          typeId:v.typeId,
          comment:v.comment,
          amount:v.amount,
          date:date
        });
      });
      console.log('template', JSON.stringify(transactionsToAdd));
      this.transactionsService.addTransactions(transactionsToAdd).subscribe(()=>{
            this.transactionsService.getTransactionsByDate(date,new Date()).subscribe((data:any[])=>{
              this.transactions = this.initTransactions(data);
            });            
          },err=>console.log('error adding transactions',err));
    }
  }
}
