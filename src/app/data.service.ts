import { Injectable } from '@angular/core';
import {InMemoryDbService,RequestInfo} from 'angular-in-memory-web-api'

@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService{
  createDb(reqInfo?: RequestInfo): {} | import("rxjs").Observable<{}> | Promise<{}> {
    let  prayers =  [
      {  id:  1,  firstName:  'משה', lastName:'זהבי' },
      {  id:  2,  firstName:  'שלמה', lastName:'ימיני' },
      {  id:  3,  firstName:  'אריאל המשתכנז', lastName:'ימיני' },
      {  id:  4,  firstName:  'יהודה', lastName:'דר' }
     ];
  
     var now = Date.now();
     let transactions=[
        {id:1,prayerName:'משה זהבי',description:'שביעי',amount:50,date:new Date(2019,8,1).toLocaleDateString()},
        {id:2,prayerName:'שלמה ימיני',description:'חמישי',amount:55,date:new Date(2019,8,2).toLocaleDateString()},
        {id:3,prayerName:'שלמה ימיני',description:'מוסף',amount:40,date:new Date(2019,8,1).toLocaleDateString()},
        {id:4,prayerName:'יהודה דאר',description:'שביעי',amount:30,date:new Date(2019,8,2).toLocaleDateString()},        
     ];
     return {prayers: prayers,transactions:transactions};
  }
  

  constructor() { }
}
