import { UsersService } from '../users.service';
import { Component, OnInit,ViewChild  } from '@angular/core';
import { MatDialog, MatTable } from '@angular/material';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users:any[]
  displayedColumns = ['id','lastName','firstName','isGuest','action'];
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  action: string;
  updatedUserId: number;

  constructor(private usersService:UsersService, public dialog: MatDialog) { }

  ngOnInit() {
    this.usersService.getUsers().subscribe((data : any[])=>{
      console.log('ngOnInit ',data);
      this.users = data;      
    });
  }

  refreshUsers(){
    this.usersService.getUsers().subscribe((data : any[])=>{
      console.log('refreshUsers ', data);
      this.users = data;      
      //this.table.renderRows();
    });
  }
  setAction(action,obj) {
    this.action = action;
    this.updatedUserId = obj.id;
  }
  saveUser(row){
    this.usersService.updateUser(row.id,{
      firstName:row.firstName,
      lastName:row.lastName,
      email:'row.email',
      isGuest:row.isGuest
    }).subscribe((data : any)=>{
      this.refreshUsers();
      this.action = null;
      this.updatedUserId = null;
    },err=>console.log('error saving user',err));
  }
  deleteUser(userId:number){
    this.usersService.deleteUser(userId).subscribe(()=>{
      this.refreshUsers();
      this.action = null;
      this.updatedUserId = null;
    },err=>console.log('error removing user',err));
  }
  // openDialog(action,obj) {
  //   obj.action = action;
  //   obj.dialogType = 'prayer';
  //   const dialogRef = this.dialog.open(DialogBoxComponent, {
  //     width: '250px',      
  //     data:obj,      
  //   });
 
  //   dialogRef.afterClosed().subscribe(result => {
  //     if(result.event == 'Add'){
  //       this.addRowData(result.data);
  //     }else if(result.event == 'Update'){
  //       this.updateRowData(result.data);
  //     }else if(result.event == 'Delete'){
  //       this.deleteRowData(result.data);
  //     }
  //   });
  // }

  addRowData(row_obj){    
    this.usersService.addUser(row_obj.name).subscribe((data)=>{
      this.usersService.getUsers().subscribe((data : any[])=>{        
        this.users = data;
        this.table.renderRows();
      })
    })
  }

  updateRowData(row_obj){
    this.users = this.users.filter((value,key)=>{
      if(value.id == row_obj.id){
        value.lastName = row_obj.lastName;
        value.firstName = row_obj.firstName;
        this.table.renderRows();
      }
      return true;
    });
  }

  deleteRowData(row_obj){
    this.users = this.users.filter((value,key)=>{
      return value.id != row_obj.id;
    });
  }
}
