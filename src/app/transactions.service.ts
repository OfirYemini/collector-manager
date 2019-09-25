import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  //SERVER_URL: string = "http://localhost:8080/api/";
  SERVER_URL: string = "https://kgz5a5cmll.execute-api.eu-central-1.amazonaws.com/dev/";
  endpoint = 'transactions';
  settingsEndpoint = 'transactionsSettings';

  constructor(private httpClient: HttpClient) { }

  public getTransactions(from:Date,to:Date,prayerId?:number){      
       return this.httpClient.get(`${this.SERVER_URL + this.endpoint}/?from=${from.getTime()}&to=${to.getTime()}`);
  }

  public getTransactionTypes(){      
    return this.httpClient.get(`${this.SERVER_URL + this.endpoint}/settings`);
  }

  public getTransaction(id:number){      
    return this.httpClient.get(`${this.SERVER_URL + this.endpoint}/${id}`);
  }

  public getTransactionByUser(userId:number){
       return this.httpClient.get(`${this.SERVER_URL + this.endpoint}/users/${userId}`); 
  }
  
  public addTransaction(trans:any){
      return this.httpClient.post(`${this.SERVER_URL + this.endpoint}`,trans);
  }

  public deleteTransaction(transId:number){
      return this.httpClient.delete(`${this.SERVER_URL + this.endpoint}/${transId}`)
  }
  public updateTransaction(trans:any){
      return this.httpClient.put(`${this.SERVER_URL + this.endpoint}/${trans.id}`,trans)
  }
}
