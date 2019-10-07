import { UsersService } from './../users.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ReportsService } from '../reports.service';
import { HebrewDateService } from '../hebrew-date.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  periods: string[] = ['H1', 'H2'];
  years: number[] = [];

  //hebrewDate:Observable<any>;
  hebrewDate: any;
  eofDateTs: number;
  reports: any[];
  users: any = {};


  constructor(route: ActivatedRoute, private reportService: ReportsService, private hebDateService: HebrewDateService, private usersService: UsersService) {
    var currentYear = new Date().getFullYear();
    for (var i = 0; i <= 3; i++) {
      this.years[i] = currentYear - i;
    }
  }

  ngOnInit() {
    this.usersService.getUsers().subscribe((users: any[]) => {
      users.forEach((u) => {
        this.users[u.id] = { ...u, ...{ fullName: u.lastName + ' ' + u.firstName } };
      }, this);
    });
  }

  getReports() {
    var from = new Date();
    from.setDate(from.getDate() - 14);
    var until = new Date(1568190861684);

    this.hebrewDate = this.hebDateService.getHebrewDate(until.getTime());

    this.reportService.getAllReports(from, until).subscribe((data: any[]) => {
      console.log(data);
      this.reports = data;
    });

  }
}
