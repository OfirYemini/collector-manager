import { Injectable } from '@angular/core';
import {  CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js'
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {  
  private _userPool:CognitoUserPool;
  _cognitoUser: CognitoUser;
  constructor() {    
    let data = {
      UserPoolId: 'eu-central-1_kbheFh6SU', // your user pool id here
      ClientId: 'tqopm6bgbqm90nq5iipg2a7b7'
    };
    this._userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
  }

  public isAuthenticated() {
    return this._userPool.getCurrentUser() != null;
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
