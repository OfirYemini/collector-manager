import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {


  //SERVER_URL: string = "http://localhost:8080/api/";
  SERVER_URL: string = "https://24mdfdusj8.execute-api.eu-central-1.amazonaws.com/dev/";
  endpoint = 'users';

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  public getUsers(){ 
    const headers = new HttpHeaders({ 'Authorization': this.authService.getTokenId() });
    //headers.set('myheader','myvalue');    
    return this.httpClient.get(`${this.SERVER_URL + this.endpoint}`,{headers:headers});
  }

  public getUser(id:number){
       return this.httpClient.get(`${this.SERVER_URL + this.endpoint}/${id}`); 
  }
  
  public addUser(user: {lastName: string,firstName: string,email: string,isGuest: boolean}){
      return this.httpClient.post(`${this.SERVER_URL + this.endpoint}`,user);
  }

  public deleteUser(id:number){
      return this.httpClient.delete(`${this.SERVER_URL + this.endpoint}/${id}`)
  }
  public updateUser(id: number,details: {lastName: string,firstName: string,email: string,isGuest: boolean}){
      return this.httpClient.put(`${this.SERVER_URL + this.endpoint}/${id}`,details);
  }
}
