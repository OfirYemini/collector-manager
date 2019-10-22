import { Injectable } from '@angular/core';
import {CognitoAuth} from 'amazon-cognito-auth-js'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  public isAuthenticated(){
    return false;
  }

  public signOut(){
    console.log('todo');
  }
  public signIn(){
    var authData = {
      ClientId : 'tqopm6bgbqm90nq5iipg2a7b7', // Your client id here
      AppWebDomain : 'gabay-notebook.auth.eu-central-1.amazoncognito.com',
      TokenScopesArray : ['phone', 'email', 'profile','openid'],
      RedirectUriSignIn : 'https://gabay-notebook.com/users',
      RedirectUriSignOut : 'https://gabay-notebook.com',
      //IdentityProvider : '<TODO: add identity provider you want to specify>', // e.g. 'Facebook',
      UserPoolId : 'eu-central-1_kbheFh6SU', // Your user pool id here
      //AdvancedSecurityDataCollectionFlag : '<TODO: boolean value indicating whether you want to enable advanced security data collection>', // e.g. true
      //Storage: '<TODO the storage object>' // OPTIONAL e.g. new CookieStorage(), to use the specified storage provided
    };
    var auth = new CognitoAuth(authData);

    return Observable.create(observer=>{
      auth.userhandler = {			
        onSuccess: function(result) {
          console.log("Sign in success",result);
          //showSignedIn(result);
          observer.next(result);
          observer.complete();
        },
        onFailure: function(err) {
          console.log("Error!" + err);
          observer.error(err);
        }
      };
      auth.getSession();
    });

    
    //auth.setState(<state parameter>);
    
  }
}
