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
  public showSignUpBox : boolean = true;

  public isLoading : boolean = false;

  public firstName : string = "";
  public lastName : string = "";
  public email : string = "";
  public password : string = "";

  public error : string | undefined = undefined;

  constructor(private dataService : DataService, 
    private userService : UserService,
    private ngZone : NgZone
  ) {}

  ngOnInit(): void {
    this.error = undefined;
    this.userService.CheckLogin();
  }

  public disableSignUpButton() : boolean {
    return (this.firstName.trim() == "") || (this.email.trim() == "") || (this.password.trim() == "");
  }

  public disableSignInButton() : boolean {
    return (this.email.trim() == "") || (this.password.trim() == "");
  }

  public SignUp() {
    if(this.isLoading) return;
    this.isLoading = true;
    this.userService.SignUp(this.firstName,this.lastName,this.email,this.password);
  }

  public SignIn() {
    if(this.isLoading) return;
    this.isLoading = true;
    this.error = undefined;
    this.userService.SignIn(this.email,this.password).subscribe({
      error : (error) => {
        this.error = error.error;
        this.isLoading = false;
      }
    });
  }
}
