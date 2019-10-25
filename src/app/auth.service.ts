import { Injectable } from '@angular/core';
import {  CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js'
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { Observable, Subject, BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    
  private _userPool:CognitoUserPool;
  private _cognitoUser: CognitoUser;
  private clientId: string = 'tqopm6bgbqm90nq5iipg2a7b7';
  _userData: AmazonCognitoIdentity.UserData;
  tokenId: string = null;  
  subject: Subject<string>;

  constructor() {    
    this.subject = new ReplaySubject();
    
    this.subject.subscribe(data=>{
      console.log('token received',data)
    },err=>{
      console.log('error token received',err)
    },()=>{console.log('subject completed')});
    let data = {
      UserPoolId: 'eu-central-1_kbheFh6SU', // your user pool id here
      ClientId: this.clientId
    };

    this._userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
    let user = this._userPool.getCurrentUser();
    var that = this;
    if(user!==null) {
      user.getSession( (err, session) => {
        if (err) {
          console.log(err);
          that.subject.error(err);
          return;
        }
        
        //console.log(that.tokenId);
        this.initAuth(user, session.getIdToken().getJwtToken(),that);
      });      
    }     
  }
  
  private initAuth(user: CognitoUser, tokenId:string,that: this) {
    that._cognitoUser = user;
    that.tokenId = tokenId;
    user.getUserData(function (err, userData) {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      that._userData = userData;
      that.subject.next(that.tokenId);
      that.subject.complete();
    });
  }

  onAuthentication(): Observable<string> {
    var obs = this.subject.asObservable();    

    // obs.subscribe(data=>{
    //   console.log('obs token received',data)
    // },err=>{
    //   console.log('obs error token received',err)
    // },()=>{console.log('obs subject completed')});    

    return obs;
  }
  getTokenId(): string {
    return this.tokenId;
    //return 'eyJraWQiOiJGUXFVZEVySUFOR2NRcW1FVGE3U1wvRlMxNGJkNGQ4aml4MDQybVQ1d1hGST0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI5ZjgwN2QzNi1jZGE3LTRiNDktYTJjZC0yMTg1OWIzMmVlOGEiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfa2JoZUZoNlNVIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjp0cnVlLCJjb2duaXRvOnVzZXJuYW1lIjoiOWY4MDdkMzYtY2RhNy00YjQ5LWEyY2QtMjE4NTliMzJlZThhIiwiYXVkIjoidHFvcG02YmdicW05MG5xNWlpcGcyYTdiNyIsImV2ZW50X2lkIjoiMmZkYmE3NmEtNGYxMS00OGI2LWE3MzItZDAzZmZhMWFlNjk3IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NzE4MjEzMTAsInBob25lX251bWJlciI6Iis5NzI1MjMzOTIwMTciLCJleHAiOjE1NzE4Mjk0NTEsImlhdCI6MTU3MTgyNTg1MSwiZW1haWwiOiJvZmlyeTE5ODFAZ21haWwuY29tIn0.DqWsiRl3bFVAjT80ZOzdHiFdh8weu10CL0xykvqjFav8Q-BT_DMu5B-1B4ozUv22c3_xyqtCbuKPg5m81GT_hGb0Xa97VveQRMUMInrnQAHylDuQiwjdkkwJKFx26VeIwYO4OTKDUHzD6LKic4mNmXNEjxU6MFmhdnAviR8bRe2Zzd2CRN9x9ynDUOBVlIBL3T1rOyvXWzy9FBt9K9wR4KbLEJ2VgN68Q4szfm4SKec9zyLudF1U9Fe6ocQplx67k8vxihgPCcWWvwy2OcagxSb5_rDIBZpReGyjZKM7HIRtNLdxYvV3IK9CzNEMyg5xCeh4KVuOGA5ld274j-dKXw';
  }  
  public getCurrentUserEmail() {    
    return this._userData!==null ? this._userData.UserAttributes.find(t=>t.Name=="email").Value : null;
  }

  public isAuthenticated() {
    return this.tokenId!==null;
    // var currentUser =  this._userPool.getCurrentUser();
    
    // return currentUser!==null;
  }

  public signOut() {
    this._userPool.getCurrentUser().signOut();
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

      let user = new AmazonCognitoIdentity.CognitoUser(userData);
      var that = this;
      user.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {          
          var tokenId = result.getIdToken().getJwtToken();
          that.initAuth(user,tokenId,that);
          
          observer.next(tokenId);          
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
