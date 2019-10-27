import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { TransactionsService } from '../transactions.service';
import { Observable, combineLatest } from 'rxjs';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

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

  transactionsTypes: string[];
  transactionsTypesArr: any;
  filteredTransactionsTypes: Observable<string[]>;
  isReceiptInputVisible: boolean = false;
  users: any[];
  @ViewChild(NgForm, { static: true }) templateForm: NgForm;
  displayedColumns = ['id', 'userName', 'transactionType', 'amount', 'comment', 'date', 'action'];
  constructor(private transactionsService: TransactionsService, private usersService: UsersService, private router: Router, private _authService: AuthService) {
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
    const users$ = this.usersService.getUsers();
    const transactionTypes$ = this.transactionsService.getTransactionTypes();


    combineLatest(users$, transactionTypes$, (users: any[], settings: any) => ({ users: users, settings: settings }))
      .subscribe(data => {
        initTransactionTypes(data.settings.transTypes);
        this.templates = data.settings.templates;
        Object.keys(data.settings.templates).forEach(templateId => {
          this.templatesArr.push({ id: templateId, name: data.settings.templates[templateId].name });
        });
        this.filteredTemplatesArr = this.templatesArr;

        data.users.forEach((u) => {
          u.fullName = u.lastName + ' ' + u.firstName;
        });
        this.users = data.users;
        this.onTemplateChanged(1);
      })

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
        // this.transactionsService.getTransactionsByDate(date, new Date()).subscribe((data: any[]) => {
        //   this.transactions = this.initTransactions(data);
        // });
      }, err => console.log('error adding transactions', err));
    }
  }
}
