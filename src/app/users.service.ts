import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class UsersService {


  //SERVER_URL: string = "http://localhost:8080/api/";
  SERVER_URL: string = "https://24mdfdusj8.execute-api.eu-central-1.amazonaws.com/dev/";
  endpoint = 'users';

  constructor(private httpClient: HttpClient) { }

  public getUsers(){ 
       return this.httpClient.get(`${this.SERVER_URL + this.endpoint}`);
  }

  public getUser(id:number){
       return this.httpClient.get(`${this.SERVER_URL + this.endpoint}/${id}`); 
  }
  
  public addUser(name: string){
      return this.httpClient.post(`${this.SERVER_URL + this.endpoint}`,{name:name});
  }

  public deleteUser(id:number){
      return this.httpClient.delete(`${this.SERVER_URL + this.endpoint}/${id}`)
  }
  public updatePrayer(user: {id: number, name: string}){
      return this.httpClient.put(`${this.SERVER_URL + this.endpoint}/${user.id}`,user.name)
  }
}
