import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private _authService:AuthService) { }

  ngOnInit() {
    if(!this._authService.isAuthenticated()){
      this._authService.signIn().subscribe(result=>{
        console.log(result);
      });
    }
  }

}
