import { ReportsService } from './../reports.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HebrewDateService } from '../hebrew-date.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  hebrewDate:any;
  eofDateTs:number;
  reports:any[];

  constructor(route: ActivatedRoute,private reportService: ReportsService,private hebDateService:HebrewDateService) {
    this.eofDateTs = route.snapshot.params['eofDateTs'];     
  }

  ngOnInit() {
    var from = new Date();
    from.setDate(from.getDate()-14);
    
    this.hebDateService.getHebrewDate(this.eofDateTs).subscribe((data:any)=>{
      console.log(data);
      this.hebrewDate = data;
    });

    this.reportService.getAllReports(from,new Date()).subscribe((data : any[])=>{
      console.log(data);
      this.reports = data;
    });
  }

}
