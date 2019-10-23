import { Injectable } from '@angular/core';
import {  CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js'
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {  
  private _userPool:CognitoUserPool;
  private _cognitoUser: CognitoUser;
  private clientId: string = 'tqopm6bgbqm90nq5iipg2a7b7';

  constructor() {    
    let data = {
      UserPoolId: 'eu-central-1_kbheFh6SU', // your user pool id here
      ClientId: this.clientId
    };
    this._userPool = new AmazonCognitoIdentity.CognitoUserPool(data);

    this._userPool.getCurrentUser().getSession( (err, session) => {
      if (err) {
        console.log(err);
        return;
      }
      const token = session.getIdToken().getJwtToken(); 
      console.log(token);
    });
  }

  public isAuthenticated() {
    var currentUser =  this._userPool.getCurrentUser();
    
    return currentUser!==null;
  }

  public signOut() {
    this._cognitoUser.signOut();
  }
  public signIn(username:string,password:string) {
    //this._auth.setState();
    return Observable.create(observer => {
      var userData = {
        Username: username, // your username here
        Pool: this._userPool
      };
      var authenticationData = {
        Username: username, // your username here
        Password: password, // your password here
      };
      var authenticationDetails =
        new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

      this._cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
      var that = this;
      this._cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          var accessToken = result.getAccessToken().getJwtToken();
          observer.next(accessToken);
          observer.complete();
        },

        onFailure: function (err) {          
          observer.error(err);
        },
        mfaRequired: function (codeDeliveryDetails) {
          var verificationCode = prompt('Please input verification code', '');
          this._cognitoUser.sendMFACode(verificationCode, this);
        }
      });
    });
  }
}
