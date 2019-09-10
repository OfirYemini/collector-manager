import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  SERVER_URL: string = "http://localhost:8080/api/";
  endpoint = 'reports';
  

  constructor(private httpClient: HttpClient) { }

  public getAllReports(from:Date,to:Date){      
       return this.httpClient.get(`${this.SERVER_URL + this.endpoint}`);
  }

  public getReportByUserId(from:Date,to:Date,userId:number){      
    return this.httpClient.get(`${this.SERVER_URL + this.endpoint}/userId=${userId}`);
  } 
}





