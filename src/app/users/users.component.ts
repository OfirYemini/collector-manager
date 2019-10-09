import { UsersService } from '../users.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTable, MatPaginator, MatTableDataSource } from '@angular/material';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[]
  displayedColumns = ['id', 'lastName', 'firstName', 'email', 'isGuest', 'action'];
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  action: string;
  updatedUserId: number;
  newRow: any = { isGuest: false };
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource:MatTableDataSource<User>;
  constructor(private usersService: UsersService, public dialog: MatDialog) { }

  ngOnInit() {
    this.usersService.getUsers().subscribe((data: any[]) => {
      console.log('ngOnInit ', data);
      this.users = data.filter(u => u.isActive);      
      this.dataSource = new MatTableDataSource<User>(this.users);
      this.dataSource.paginator = this.paginator;
    });
  }

  refreshUsers() {
    this.usersService.getUsers().subscribe((data: any[]) => {
      console.log('refreshUsers ', data);
      this.users = data.filter(u => u.isActive);
      this.table.renderRows();
    });
  }
  setAction(action, obj) {
    this.action = action;
    this.updatedUserId = obj.id;
  }
  addUser() {
    this.usersService.addUser(this.newRow).subscribe((data: any) => {
      this.refreshUsers();
      this.action = null;
      this.updatedUserId = null;
      this.newRow = {};
    }, err => console.log('error adding user', err));
  }
  saveUser(row) {
    this.usersService.updateUser(row.id, {
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      isGuest: row.isGuest
    }).subscribe((data: any) => {
      this.refreshUsers();
      this.action = null;
      this.updatedUserId = null;
    }, err => console.log('error saving user', err));
  }
  deleteUser(userId: number) {
    this.usersService.deleteUser(userId).subscribe(() => {
      this.refreshUsers();
      this.action = null;
      this.updatedUserId = null;
    }, err => console.log('error removing user', err));
  }
}

export interface User {
  id:number,
  firstName: string,
  lastName: string,
  email: string,
  isGuest: boolean
}
