import { Component, NgZone, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.css']
})
export class HomeScreenComponent implements OnInit {

  public enableGoogleSignIn : boolean = false;
  public isLoggedIn : boolean = false;
  public user : Observable<any> = of(undefined);

  constructor(private dataService : DataService, 
    private userService : UserService,
    private ngZone : NgZone,
    public afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.user = this.afAuth.authState;
    this.userService.CheckLogin();
    this.userService.isGoogleSignInEnabled$.subscribe(x => {
      this.ngZone.run(() => {
        this.enableGoogleSignIn = x;
      })
    });
  }

  public SignInWithGoogle() : void {

    this.userService.SignInWithGoogle();

  }
}
