import { Component, OnInit,ViewChild  } from '@angular/core';
import { MatDialog, MatTable } from '@angular/material';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { TransactionsService } from './../transactions.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactions:any[]
  displayedColumns = ['id', 'prayerName','description','amount','date','action'];
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;

  constructor(private transactionsService:TransactionsService, public dialog: MatDialog) { }

  ngOnInit() {
    var from = new Date();
    from.setDate(from.getDate()-14);
    
    this.transactionsService.getTransactions(from,new Date()).subscribe((data : any[])=>{
      console.log(data);
      this.transactions = data;
    });
  }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data:obj
    });
 
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.addRowData(result.data);
      }else if(result.event == 'Update'){
        this.updateRowData(result.data);
      }else if(result.event == 'Delete'){
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(row_obj){    
    this.transactionsService.addTransaction(row_obj).subscribe((data)=>{
      this.transactionsService.getTransaction(row_obj.id).subscribe((data : any)=>{        
        this.transactions.push(data);
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
