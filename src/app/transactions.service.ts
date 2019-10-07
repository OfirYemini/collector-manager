import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  SERVER_URL: string = "https://kgz5a5cmll.execute-api.eu-central-1.amazonaws.com/dev/";
  endpoint = 'transactions';
  settingsEndpoint = 'transactionsSettings';

  constructor(private httpClient: HttpClient) { }

  public getTransactionsByDate(from: Date, to: Date) {
    from.setHours(0, 0, 0, 0); // start of day
    to.setHours(23, 59, 59, 999); // end of day
    return this.httpClient.get(`${this.SERVER_URL + this.endpoint}/?from=${from.getTime()}&to=${to.getTime()}`);
  }
  public getTransactionsByIds(ids: number[]) {
    return this.httpClient.get(`${this.SERVER_URL + this.endpoint}/?id=${ids.join(',')}`);
  }

  public getTransactionTypes() {
    return this.httpClient.get(`${this.SERVER_URL + this.endpoint}/settings`);
  }

  public getTransaction(id: number) {
    return this.httpClient.get(`${this.SERVER_URL + this.endpoint}/${id}`);
  }

  public getTransactionByUser(userId: number) {
    return this.httpClient.get(`${this.SERVER_URL + this.endpoint}/users/${userId}`);
  }

  public addTransactions(trans: { userId: number, typeId: number, amount: number, date: Date }[]) {
    return this.httpClient.post(`${this.SERVER_URL + this.endpoint}`, trans);
  }

  public deleteTransaction(transId: number) {
    return this.httpClient.delete(`${this.SERVER_URL + this.endpoint}/${transId}`)
  }
  public updateTransaction(id: number, trans: { userId: number, typeId: number, amount: number, date: Date }) {
    return this.httpClient.put(`${this.SERVER_URL + this.endpoint}/${id}`, trans)
  }
}
