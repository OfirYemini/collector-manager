import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { TransactionsService } from '../transactions.service';
import { Observable, combineLatest, map } from 'rxjs';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit {
  templates: any[];
  filteredTemplatesArr: any[];
  templatesArr: any[] = [];
  templateDateCtl: FormControl;
  receiptInitNumberCtl: FormControl = new FormControl();
  currentTemplate: any[];
  currentTemplateId:number;
  transactionsTypes: string[];
  transactionsTypesArr: any;
  filteredTransactionsTypes: Observable<string[]>;
  isReceiptInputVisible: boolean = false;
  users: any[];
  @ViewChild(NgForm, { static: true }) templateForm: NgForm;
  displayedColumns = ['id', 'userName', 'transactionType', 'amount', 'comment', 'date', 'action'];
  constructor(private transactionsService: TransactionsService, private usersService: UsersService, private router: Router, private _authService: AuthService,private _snackBar: MatSnackBar) {
    if (!this._authService.isAuthenticated()) {
      this.router.navigateByUrl('/login');
    }
  }

  ngOnInit() {    
    var prevSaturday = new Date();
    prevSaturday.setDate(prevSaturday.getDate() - (prevSaturday.getDay() + 3) % 7)
    this.templateDateCtl = new FormControl(new Date(prevSaturday));
    this.transactionsService.getTransactionTypes();

    let _this = this;
    function initTransactionTypes(settings: any) {
      _this.transactionsTypes = settings.reduce(function (map, obj) {
        map[obj.id] = obj.name;
        return map;
      }, {});
      _this.filteredTransactionsTypes = settings;
      _this.transactionsTypesArr = settings;
    };
    const users$:Observable<any> = this.usersService.getUsers();
    const transactionTypes$:Observable<any> = this.transactionsService.getTransactionTypes();


    combineLatest([users$, transactionTypes$])
  .pipe(
    map(([users, settings]) => ({
      users: users,
      settings: settings
    }))
  )
  .subscribe(data => {
    // Initialize transaction types
    initTransactionTypes(data.settings.transTypes);

    // Set up templates
    this.templates = data.settings.templates;
    Object.keys(data.settings.templates).forEach(templateId => {
      this.templatesArr.push({ id: templateId, name: data.settings.templates[templateId].name });
    });
    this.filteredTemplatesArr = this.templatesArr;

    // Update users with full names
    data.users.forEach((u) => {
      u.fullName = u.lastName + ' ' + u.firstName;
    });
    this.users = data.users;

    // Trigger additional logic
    this.onTemplateChanged(1);
  });

    //     this.templateForm.valueChanges.subscribe(value => {
    //       console.log('on change');
    //       if(value.b === 'first') {
    //           this.templateForm.controls['one'].setValidators(Validators.required)
    //           this.form.controls['two'].clearValidators()
    //       } else {
    //           this.form.controls['two'].setValidators(Validators.required)
    //           this.form.controls['one'].clearValidators()
    //       }    

    //       this.templateForm.controls['one'].updateValueAndValidity({onlySelf:true})
    //       this.templateForm.controls['two'].updateValueAndValidity({onlySelf:true})
    //  })
  }
  setGlobalDesc(text:string){
    this.currentTemplate.forEach(function (v) {      
      v.comment = text;      
    });
  }

  onAmountChange(target,index) {        
    let otherControl = this.templateForm.controls['userName-' + index];
    this.onValueChange(otherControl,target.value);
  }
  onValueChange(control,value){    
    if(value!=='' && value!==undefined) {
      control.setValidators(Validators.required);
    }        
    else {
      control.clearValidators();
    }
    control.updateValueAndValidity({ onlySelf: true });    
  }
  onUserChange(value,index){
    let otherControl = this.templateForm.controls['amount-' + index];
    this.onValueChange(otherControl,value);
  }
  onReceiptInitNumber() {
    this.receiptInitNumberCtl.value

    this.currentTemplate.forEach((row, index) => {
      var number = +(this.receiptInitNumberCtl.value) + index;
      row.comment = `קבלה ${number}`
    });
  }

  filterUsers(val: string, row: any) {
    console.log('filterUsers ', val, row);
    row.filteredUsers = this.users.filter(u => u.fullName.indexOf(val) > -1);
  }

  filterTemplates(val) {
    this.filteredTemplatesArr = this.templatesArr.filter((t) => t.name.indexOf(val) > -1);
  }
  onTemplateChanged(templateId: number) {
    console.log('template ', templateId);
    this.currentTemplateId=templateId;
    this.isReceiptInputVisible = this.templates[templateId].name == "קבלה";
    this.currentTemplate = [];
    this.templates[templateId].trans_type_ids.forEach(transTypeId => {
      this.currentTemplate.push({
        typeId: transTypeId,
        date: this.templateDateCtl.value,
        filteredUsers: this.users
      });
    });

  }
  addTransactions() {
    if (this.templateForm.valid) {
      var transactionsToAdd = [];
      let _this = this;
      let date = new Date(this.templateDateCtl.value.toDateString());
      this.currentTemplate.forEach(function (v) {
        v.filteredUsers = _this.users;
        if(v.userId !==undefined && v.amount!==undefined){
          transactionsToAdd.push({
            userId: v.userId,
            typeId: v.typeId,
            comment: v.comment,
            amount: v.amount,
            date: date
          });
        }
        
      });
      
      console.log('template', JSON.stringify(transactionsToAdd));
      this.transactionsService.addTransactions(transactionsToAdd).subscribe(() => {
        this._snackBar.open("Transactions Added successfully",null,{duration: 5000,horizontalPosition:'left'});
        // this.transactionsService.getTransactionsByDate(date, new Date()).subscribe((data: any[]) => {
        //   this.transactions = this.initTransactions(data);
        // });
        this.onTemplateChanged(this.currentTemplateId);
        
      }, err => {
        this._snackBar.open("Error adding Transactions",null,{duration: 5000,horizontalPosition:'left'});
        console.log('error adding transactions', err)
      });
    }
  }
}
