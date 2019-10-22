import { Injectable } from '@angular/core';
import {  CognitoUserPool } from 'amazon-cognito-identity-js'
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private _userPool:CognitoUserPool;
  constructor() {
    var authData = {
      ClientId: 'tqopm6bgbqm90nq5iipg2a7b7', // Your client id here
      AppWebDomain: 'gabay-notebook.auth.eu-central-1.amazoncognito.com',
      TokenScopesArray: ['phone', 'email', 'profile', 'openid'],
      RedirectUriSignIn: 'https://gabay-notebook.com/users',
      RedirectUriSignOut: 'https://gabay-notebook.com',
      //IdentityProvider : '<TODO: add identity provider you want to specify>', // e.g. 'Facebook',
      UserPoolId: 'eu-central-1_kbheFh6SU', // Your user pool id here
      //AdvancedSecurityDataCollectionFlag : '<TODO: boolean value indicating whether you want to enable advanced security data collection>', // e.g. true
      //Storage: '<TODO the storage object>' // OPTIONAL e.g. new CookieStorage(), to use the specified storage provided
    };
    let data = {
      UserPoolId: 'eu-central-1_kbheFh6SU', // your user pool id here
      ClientId: 'tqopm6bgbqm90nq5iipg2a7b7'
    };
    this._userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
    

  }

  public isAuthenticated() {
    return false;
  }

  public signOut() {
    //this._auth.signOut();
  }
  public signIn() {
    //this._auth.setState();
    return Observable.create(observer => {
      var userData = {
        Username: 'ofiry1981@gmail.com', // your username here
        Pool: this._userPool
      };
      var authenticationData = {
        Username: 'ofiry1981@gmail.com', // your username here
        Password: 'Aa123456@', // your password here
      };
      var authenticationDetails =
        new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

      var cognitoUser =
        new AmazonCognitoIdentity.CognitoUser(userData);
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          var accessToken = result.getAccessToken().getJwtToken();
        },

        onFailure: function (err) {
          alert(err);
        },
        mfaRequired: function (codeDeliveryDetails) {
          var verificationCode = prompt('Please input verification code', '');
          cognitoUser.sendMFACode(verificationCode, this);
        }
      });
    });
  }
}
