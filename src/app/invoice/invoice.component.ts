import { ReportsService } from './../reports.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  invoiceIds: string[];
  reports:any[];

  constructor(route: ActivatedRoute,private reportService: ReportsService) {
    this.invoiceIds = route.snapshot.params['invoiceIds']
      .split(',');
  }

  ngOnInit() {
    var from = new Date();
    from.setDate(from.getDate()-14);
    
    this.reportService.getAllReports(from,new Date()).subscribe((data : any[])=>{
      console.log(data);
      this.reports = data;
    });
  }

}
