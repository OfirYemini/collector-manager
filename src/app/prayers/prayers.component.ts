import { PrayersService } from './../prayers.service';
import { Component, OnInit,ViewChild  } from '@angular/core';
import { MatDialog, MatTable } from '@angular/material';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

@Component({
  selector: 'app-prayers',
  templateUrl: './prayers.component.html',
  styleUrls: ['./prayers.component.css']
})
export class PrayersComponent implements OnInit {
  prayers:any[]
  displayedColumns = ['id', 'name','action'];
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;

  constructor(private prayersService:PrayersService, public dialog: MatDialog) { }

  ngOnInit() {
    this.prayersService.getPrayers().subscribe((data : any[])=>{
      console.log(data);
      this.prayers = data;
    })
  }

  openDialog(action,obj) {
    obj.action = action;
    obj.dialogType = 'prayer';
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',      
      data:obj,      
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
    this.prayersService.addPrayer(row_obj.name).subscribe((data)=>{
      this.prayersService.getPrayers().subscribe((data : any[])=>{        
        this.prayers = data;
        this.table.renderRows();
      })
    })
  }

  updateRowData(row_obj){
    this.prayers = this.prayers.filter((value,key)=>{
      if(value.id == row_obj.id){
        value.lastName = row_obj.lastName;
        value.firstName = row_obj.firstName;
        this.table.renderRows();
      }
      return true;
    });
  }

  deleteRowData(row_obj){
    this.prayers = this.prayers.filter((value,key)=>{
      return value.id != row_obj.id;
    });
  }
}
