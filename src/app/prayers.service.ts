import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PrayersService {


  SERVER_URL: string = "http://localhost:8080/api/";
  constructor(private httpClient: HttpClient) { }

  public getPrayers(){ 
       return this.httpClient.get(this.SERVER_URL + 'prayers');
  }

  public getPrayer(prayerId:number){
       return this.httpClient.get('${this.SERVER_URL + prayer}/{prayerId}'); 
  }
  public addPrayer(prayer: {id: number, name: string}){
      return this.httpClient.post('${this.SERVER_URL + prayer}',prayer);
  }

  public deletePrayer(prayerId:number){
      return this.httpClient.delete('${this.SERVER_URL + prayers}/{prayerId}')
  }
  public updatePrayer(prayer: {id: number, name: string}){
      return this.httpClient.put('${this.SERVER_URL + prayers}/{prayer.id}',prayer.name)
  }
}
