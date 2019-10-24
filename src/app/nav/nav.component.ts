import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  currentUserName:string;
  constructor(public _authService:AuthService) { }

  ngOnInit() {
    this._authService.onAuthentication().subscribe(token=>{
      this.currentUserName = this._authService.getCurrentUserEmail();
    });
    
  }
  signOut(){
    this._authService.signOut();

  }
}
