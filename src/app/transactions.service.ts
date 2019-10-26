import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  SERVER_URL: string = "https://kgz5a5cmll.execute-api.eu-central-1.amazonaws.com/dev/";
  endpoint = 'transactions';
  settingsEndpoint = 'transactionsSettings';
  private headers: HttpHeaders;

  constructor(private httpClient: HttpClient, private authService: AuthService) {
    this.authService.onAuthentication().subscribe(tokenId => {
      console.log('trans service with ', tokenId);
      this.headers = new HttpHeaders({ 'Authorization': tokenId });
    });
  }

  public getTransactionsByDate(from: Date, to: Date) {
    from.setHours(0, 0, 0, 0); // start of day
    to.setHours(23, 59, 59, 999); // end of day
    console.log(this.authService.getTokenId());
    return this.httpClient.get(`${this.SERVER_URL + this.endpoint}/?from=${from.getTime()}&to=${to.getTime()}`, { headers: this.headers });
  }
  public getTransactionsByIds(ids: number[]) {
    return this.httpClient.get(`${this.SERVER_URL + this.endpoint}/?id=${ids.join(',')}`, { headers: this.headers });
  }

  public getTransactionTypes() {

    return this.httpClient.get(`${this.SERVER_URL + this.endpoint}/settings`, { headers: this.headers });
  }

  public getTransaction(id: number) {
    return this.httpClient.get(`${this.SERVER_URL + this.endpoint}/${id}`, { headers: this.headers });
  }

  public getTransactionByUser(userId: number) {
    return this.httpClient.get(`${this.SERVER_URL + this.endpoint}/users/${userId}`, { headers: this.headers });
  }

  public addTransactions(trans: Transaction[]) {
    return this.httpClient.post(`${this.SERVER_URL + this.endpoint}`, trans, { headers: this.headers });
  }

  public deleteTransaction(transId: number) {
    return this.httpClient.delete(`${this.SERVER_URL + this.endpoint}/${transId}`, { headers: this.headers })
  }
  public updateTransaction(id: number, trans:Transaction) {
    return this.httpClient.put(`${this.SERVER_URL + this.endpoint}/${id}`, trans, { headers: this.headers })
  }
}

export interface Transaction {
  id?:number,
  userId: number, 
  typeId: number, 
  amount: number, 
  comment:string,
  date: Date
}