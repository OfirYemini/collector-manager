import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  SERVER_URL: string = "https://kgz5a5cmll.execute-api.eu-central-1.amazonaws.com/dev/";
  endpoint = 'transactions/reports';
  
 
  constructor(private httpClient: HttpClient) { }

  public getAllReports(from:Date,to:Date){       
    return this.httpClient.get(`${this.SERVER_URL + this.endpoint}/?from=${from.getTime()}&to=${to.getTime()}`);
  }

  public getReportByUserId(from:Date,to:Date,userId:number){      
    return this.httpClient.get(`${this.SERVER_URL + this.endpoint}/userId=${userId}`);
  } 
}





