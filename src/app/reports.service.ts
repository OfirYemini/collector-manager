import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  SERVER_URL: string = `https://kgz5a5cmll.execute-api.eu-central-1.amazonaws.com/${environment.urlPrefix}/`;
  endpoint = 'transactions/reports';
  private headers:HttpHeaders;  
 
  constructor(private httpClient: HttpClient,private authService: AuthService) {
    this.authService.onAuthentication().subscribe(tokenId=>{
      console.log('trans service with ', tokenId);
      this.headers = new HttpHeaders({ 'Authorization': tokenId });      
    });    
   }

  public getAllReports(from:Date,to:Date){       
    from.setHours(0, 0, 0, 0); // start of day
    to.setHours(23, 59, 59, 999); // end of day
    return this.httpClient.get(`${this.SERVER_URL + this.endpoint}/?from=${from.getTime()}&to=${to.getTime()}`,{headers:this.headers});
  }

  public getReportByUserId(from:Date,to:Date,userId:number){      
    return this.httpClient.get(`${this.SERVER_URL + this.endpoint}/userId=${userId}`,{headers:this.headers});
  } 
}





