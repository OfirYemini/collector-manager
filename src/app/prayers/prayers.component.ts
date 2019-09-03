import { PrayersService } from './../prayers.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prayers',
  templateUrl: './prayers.component.html',
  styleUrls: ['./prayers.component.css']
})
export class PrayersComponent implements OnInit {
  prayers:any[]
  displayedColumns = ['id', 'name'];
  
  constructor(private prayersService:PrayersService) { }

  ngOnInit() {
    this.prayersService.getPrayers().subscribe((data : any[])=>{
      console.log(data);
      this.prayers = data;
  })
  }

}
