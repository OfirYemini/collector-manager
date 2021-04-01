import { UsersService } from './../users.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ReportsService } from '../reports.service';
import Hebcal from 'hebcal';
import { AuthService } from '../auth.service';

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
  gReports: any[];
  users: any = {};
  selectedPeriodIndex:number;
  selectedYear:{value:number,text:string};
  reportDisplayedYear:string;
  constructor(route: ActivatedRoute, private reportService: ReportsService,  private usersService: UsersService,private _authService:AuthService,private router: Router) {

    if (!this._authService.isAuthenticated()) {
      this.router.navigateByUrl('/login');
    }

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
    this.reportDisplayedYear = this.selectedPeriodIndex==0 ? this.selectedYear.text:Hebcal.gematriya(this.selectedYear.value+1);
    
     
    //var day = new Hebcal.HDate(7, 2, 5770);
    var from = new Hebcal.HDate(selectedPeriod.startDay, selectedPeriod.startMonth,this.selectedYear.value); //ערב פסח
    var until = new Hebcal.HDate(selectedPeriod.endDay, selectedPeriod.endMonth,this.selectedYear.value); 
    var HebcalDate = Hebcal.HDate;
    this.reportService.getAllReports(from.greg(), until.greg()).subscribe((data: any[]) => {
      console.log(data);
      
      this.reports = data.filter(x=>!this.users[x.userId].isGuest).map((r)=>{
        r.transactions = r.transactions.map((t)=>{
          let hebDate = new HebcalDate(new Date(t.date));
          var isStartOfPeriod = (selectedPeriod.startDay-1)==hebDate.getDate() && selectedPeriod.startMonth==hebDate.getMonth();
          t.date = isStartOfPeriod ? ('ערב ' + selectedPeriod.startText + ' ' + this.selectedYear.text): (Hebcal.gematriya(hebDate.getDate()) + ' ' + this.gregToHebMonth[hebDate.getMonthName()]);
          return t;
        },this);
        return r;
      },this);

      this.gReports = data.filter(x=>this.users[x.userId].isGuest).map((r)=>{
        r.transactions = r.transactions.map((t)=>{
          let hebDate = new HebcalDate(new Date(t.date));
          var isStartOfPeriod = (selectedPeriod.startDay-1)==hebDate.getDate() && selectedPeriod.startMonth==hebDate.getMonth();
          t.date = isStartOfPeriod ? ('ערב ' + selectedPeriod.startText + ' ' + this.selectedYear.text): (Hebcal.gematriya(hebDate.getDate()) + ' ' + this.gregToHebMonth[hebDate.getMonthName()]);
          return t;
        },this);
        return r;
      },this);
    });

  }
}
