import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  SERVER_URL: string = "http://localhost:8080/api/";
  endpoint = 'transactions';

  constructor(private httpClient: HttpClient) { }

  public getTransactions(from:Date,to:Date,prayerId?:number){      
       return this.httpClient.get(`${this.SERVER_URL + this.endpoint}`);
  }

  public getTransactionByPrayer(prayerId:number){
       return this.httpClient.get(`${this.SERVER_URL + this.endpoint}/prayers/{prayerId}`); 
  }
  
  public addTransaction(trans:any){
      return this.httpClient.post(`${this.SERVER_URL + this.endpoint}`,trans);
  }

  public deleteTransaction(transId:number){
      return this.httpClient.delete(`${this.SERVER_URL + this.endpoint}/{transId}`)
  }
  public updateTransaction(trans:any){
      return this.httpClient.put(`${this.SERVER_URL + this.endpoint}/{trans.id}`,trans)
  }
}
