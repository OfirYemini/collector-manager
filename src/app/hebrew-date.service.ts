import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HebrewDateService {

  SERVER_URL: string = "http://localhost:8080/api/";
  endpoint = 'hebrewCalendar';  

  constructor(private httpClient: HttpClient) { }

  public getHebrewDate(ts:number){      
       return this.httpClient.get(`${this.SERVER_URL + this.endpoint}/?ts=${ts}`);
  }
}
