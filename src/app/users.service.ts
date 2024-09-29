import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class UsersService {


  //SERVER_URL: string = "http://localhost:8080/api/";
  SERVER_URL: string = `https://${environment.usersApiUrl}.execute-api.eu-central-1.amazonaws.com/${environment.urlPrefix}/`;
  endpoint = 'users';
  private headers:HttpHeaders;
  constructor(private httpClient: HttpClient, private authService: AuthService) { 
    this.authService.onAuthentication().subscribe(tokenId=>{
      console.log('user service with ', tokenId);
      this.headers = new HttpHeaders({ 'Authorization': tokenId });      
    });    
  }


  public getUsers(){ 
    return this.httpClient.get(`${this.SERVER_URL + this.endpoint}`,{headers:this.headers});
  }

  public getUser(id:number){
       return this.httpClient.get(`${this.SERVER_URL + this.endpoint}/${id}`,{headers:this.headers}); 
  }
  
  public addUser(user: {lastName: string,firstName: string,email: string,isGuest: boolean,isActive: boolean}){
      return this.httpClient.post(`${this.SERVER_URL + this.endpoint}`,user,{headers:this.headers});
  }

  public deleteUser(id:number){
      return this.httpClient.delete(`${this.SERVER_URL + this.endpoint}/${id}`,{headers:this.headers})
  }
  public updateUser(id: number,details: {lastName: string,firstName: string,email: string,isGuest: boolean,isActive: boolean}){
      return this.httpClient.put(`${this.SERVER_URL + this.endpoint}/${id}`,details,{headers:this.headers});
  }
}
