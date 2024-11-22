import { Component, NgZone, OnInit } from '@angular/core';
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
  public user : any;

  constructor(private dataService : DataService, 
    private userService : UserService,
    private ngZone : NgZone
  ) {}

  ngOnInit(): void {
    this.userService.CheckLogin();
    this.userService.isGoogleSignInEnabled$.subscribe(x => {
      this.ngZone.run(() => {
        this.enableGoogleSignIn = x;
      })
    });
  }

  public SignInWithGoogle() : void {

    if(!this.enableGoogleSignIn) return;

    console.log("Signing in to Google!")
    this.userService.SignInWithGoogle().then(
      (googleUser) => {
        console.log(`Logged In!`)
        const profile = googleUser.getBasicProfile();
        const idToken = googleUser.getAuthResponse().id_token;
  
        console.log('Name:', profile.getName());
        console.log('Email:', profile.getEmail());
        console.log('ID Token:', idToken);
        this.isLoggedIn = true;
      },
      (error) => {
        console.error('Error signing in:', error);
      }
    );
  }
}
