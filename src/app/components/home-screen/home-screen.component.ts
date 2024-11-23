import { Component, NgZone, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.css']
})
export class HomeScreenComponent implements OnInit {

  public enableGoogleSignIn : boolean = false;
  public isLoggedIn : boolean = false;
  public user : Observable<any> = of(undefined);


  public firstName : string = "";
  public lastName : string = "";
  public email : string = "";
  public password : string = "";

  constructor(private dataService : DataService, 
    private userService : UserService,
    private ngZone : NgZone
  ) {}

  ngOnInit(): void {
    this.userService.CheckLogin();
  }

  public disableSignUpButton() : boolean {
    return (this.firstName.trim() == "") || (this.email.trim() == "") || (this.password.trim() == "");
  }

  public SignUp() {
    this.userService.SignUp(this.firstName,this.lastName,this.email,this.password);
  }
}
