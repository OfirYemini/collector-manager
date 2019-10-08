import { UsersService } from './../users.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ReportsService } from '../reports.service';
import Hebcal from 'hebcal';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  periods: {startMonth:number,endMonth:number,startDay:number,endDay:number,startText:string,endText:string}[];
  years: {value:number,text:string}[] = [];
  gregToHebMonth:any = {
    "Nisan":"ניסן",
    "Iyyar":"אייר",
    "Sivan":"סיון",
    "Tamuz":"תמוז",
    "Av":"אב",
    "Elul":"אלול",
    "Tishrei":"תשרי",
    "Cheshvan":"חשון",
    "Kislev":"כסלו",
    "Tevet":"טבת",
    "Sh'vat":"שבט"
  };
    
  //hebrewDate:Observable<any>;
  hebrewDate: any;
  eofDateTs: number;
  reports: any[];
  users: any = {};
  selectedPeriodIndex:number;
  selectedYear:{value:number,text:string};

  constructor(route: ActivatedRoute, private reportService: ReportsService,  private usersService: UsersService) {
    var currentYear = new Hebcal.HDate(new Date()).year;
    for (var i = 0; i <= 3; i++) {
      this.years[i] = {value:currentYear - i,text:Hebcal.gematriya(currentYear - i)};
    }
    this.selectedYear = this.years[0];
    this.periods = [{
      startMonth:7,
      startDay:1,
      endMonth:1,
      endDay:14,
      startText:'ראש השנה' ,
      endText:'ערב פסח'
    },{
      startMonth:1,
      startDay:15,
      endMonth:6,
      endDay:29,
      startText:'פסח' ,
      endText:'ערב ראש השנה'
    }]
  }

  ngOnInit() {
    var day = new Hebcal.HDate(14, 1); //ערב פסח

    this.usersService.getUsers().subscribe((users: any[]) => {
      users.forEach((u) => {
        this.users[u.id] = { ...u, ...{ fullName: u.lastName + ' ' + u.firstName } };
      }, this);
    });
  }

  getReports() {
    let selectedPeriod = this.periods[this.selectedPeriodIndex];
    
    //var day = new Hebcal.HDate(7, 2, 5770);
    var from = new Hebcal.HDate(selectedPeriod.startDay, selectedPeriod.startMonth,this.selectedYear.value); //ערב פסח
    var until = new Hebcal.HDate(selectedPeriod.endDay, selectedPeriod.endMonth,this.selectedYear.value); 
    var HebcalDate = Hebcal.HDate;
    this.reportService.getAllReports(from.greg(), until.greg()).subscribe((data: any[]) => {
      console.log(data);
      this.reports = data.map((r)=>{
        r.transactions = r.transactions.map((t)=>{
          let hebDate = new HebcalDate(new Date(t.date));
          t.date = Hebcal.gematriya(hebDate.getDate()) + ' ' + this.gregToHebMonth[hebDate.getMonthName()];
          return t;
        },this);
        return r;
      },this);
    });

  }
}
