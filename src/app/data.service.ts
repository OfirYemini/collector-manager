import { Injectable } from '@angular/core';
import {InMemoryDbService,RequestInfo} from 'angular-in-memory-web-api'

@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService{
  createDb(reqInfo?: RequestInfo): {} | import("rxjs").Observable<{}> | Promise<{}> {
    let  prayers =  [
      {  id:  1,  name:  'משה זהבי' },
      {  id:  2,  num:  'שלמה ימיני' },
      {  id:  3,  num:  'אריאל ימיני המשתכנז'},
      {  id:  4,  num:  'יהודה דאר' }
     ];
  
     return {prayers: prayers};
  }
  

  constructor() { }
}
