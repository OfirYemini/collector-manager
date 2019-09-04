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
  displayedColumns = ['id', 'name','action'];
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;

  constructor(private transactionsService:TransactionsService, public dialog: MatDialog) { }

  ngOnInit() {
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
    this.transactionsService.addTransaction(row_obj.name).subscribe((data)=>{
      // this.transactionsService.getTransactions().subscribe((data : any[])=>{        
      //   this.transactions = data;
      //   this.table.renderRows();
      // })
    })
  }

  updateRowData(row_obj){
    this.transactions = this.transactions.filter((value,key)=>{
      if(value.id == row_obj.id){
        value.name = row_obj.name;
      }
      return true;
    });
  }

  deleteRowData(row_obj){
    this.transactions = this.transactions.filter((value,key)=>{
      return value.id != row_obj.id;
    });
  }
}
