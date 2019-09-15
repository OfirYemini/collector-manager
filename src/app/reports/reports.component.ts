import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  private periods: string[] = ['H1','H2'];
  private years: number[] =[];
  constructor() { 
    
  }

  ngOnInit() {
    var currentYear = new Date().getFullYear();
    for(var i=0;i<=3;i++)
    {
      this.years[i] = currentYear - i;
    }
  }

}
