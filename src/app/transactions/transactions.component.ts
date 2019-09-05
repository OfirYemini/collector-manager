import { PrayersService } from './../prayers.service';
import { Component, OnInit,ViewChild  } from '@angular/core';
import { MatDialog, MatTable,MatAutocomplete } from '@angular/material';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { TransactionsService } from './../transactions.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactions:any[]
  transactionsTypes:string[]
  prayers:any[]
  newRow:any;
  displayedColumns = ['id', 'prayerName','description','amount','date','action'];
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;

  constructor(private transactionsService:TransactionsService,private prayersService: PrayersService, public dialog: MatDialog) { }

  ngOnInit() {
    var from = new Date();
    from.setDate(from.getDate()-14);
    this.newRow = {};
    this.transactionsService.getTransactions(from,new Date()).subscribe((data : any[])=>{
      console.log(data);
      this.transactions = data;
    });
    this.transactionsService.getTransactionTypes().subscribe((settings : any)=>{
      console.log(settings);
      this.transactionsTypes = settings.types;
    });
    this.prayersService.getPrayers().subscribe((data : any[])=>{      
      console.log(data);
      this.prayers = data;
    });
  }

  openDialog(action,obj) {
    obj.action = action;
    obj.dialogType = 'transaction';
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data:obj
    });
 
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        this.updateRowData(result.data);
      }else {
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(){    
    this.transactionsService.addTransaction(this.newRow).subscribe((newTransId: any)=>{
      this.transactionsService.getTransaction(newTransId.id).subscribe((data : any)=>{        
        this.transactions.push(data);
        this.newRow = {};
        this.table.renderRows();
      })
    })
  }

  updateRowData(trans:any){
    this.transactionsService.updateTransaction(trans).subscribe((row)=>{
      this.transactionsService.getTransaction(trans.id).subscribe((data : any)=>{        
        this.transactions = this.transactions.filter((value,key)=>{
          if(value.id == data.id){
            value.prayerName = data.prayerName;
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

  deleteRowData(trans:any){
    this.transactionsService.deleteTransaction(trans.id).subscribe((data)=>{
      this.transactions = this.transactions.filter((value,key)=>{
        return value.id != trans.id;
      });
    })
    
  }
}
