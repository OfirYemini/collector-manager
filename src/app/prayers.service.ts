import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class PrayersService {


  SERVER_URL: string = "http://localhost:8080/api/";
  prayers_endpoint = 'prayers';

  constructor(private httpClient: HttpClient) { }

  public getPrayers(){ 
       return this.httpClient.get(`${this.SERVER_URL + this.prayers_endpoint}`);
  }

  public getPrayer(prayerId:number){
       return this.httpClient.get(`${this.SERVER_URL + this.prayers_endpoint}/{prayerId}`); 
  }
  
  public addPrayer(name: string){
      return this.httpClient.post(`${this.SERVER_URL + this.prayers_endpoint}`,{name:name});
  }

  public deletePrayer(prayerId:number){
      return this.httpClient.delete(`${this.SERVER_URL + this.prayers_endpoint}/{prayerId}`)
  }
  public updatePrayer(prayer: {id: number, name: string}){
      return this.httpClient.put(`${this.SERVER_URL + this.prayers_endpoint}/{prayer.id}`,prayer.name)
  }
}
