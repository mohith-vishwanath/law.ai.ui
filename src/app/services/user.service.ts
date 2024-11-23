import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { UserProfile } from "../models/user";
import { HttpClient } from "@angular/common/http";
import { first } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { GoogleAuthProvider } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';


declare var gapi: any; // Declare the gapi object from Google's platform.js

@Injectable({ providedIn: "root" })
export class UserService {

    private host : string = "";
    public isGoogleSignInEnabled$ = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient, public afAuth: AngularFireAuth) {
        this.host = environment.baseUrl;
    }

    private post<T>(url : string, body : any) : Observable<T> {
        return this.http.post<T>(`${this.host}/${url}`,body,{withCredentials : true})
    }

    private get<T>(url : string) : Observable<T> {
        return this.http.get<T>(`${this.host}/${url}`,{withCredentials : true})
    }

    public LoggedInUser$ = new BehaviorSubject<UserProfile>({} as UserProfile);
    private clientId: string = '472133833229-408gndosjbnehcvsojua17ijave19l6c.apps.googleusercontent.com'; // Replace with your actual client ID

    public CheckLogin() {
        this.get<UserProfile|undefined>(`auth/check`)
        .pipe(first())
        .subscribe(user => {
            if(user) {
                console.log(`User already logged in! ${user.firstName} ${user.lastName}`);
                this.LoggedInUser$.next(user);
            } 
        });
    }

    public SignInWithGoogle() {
        const provider = new GoogleAuthProvider();
        this.afAuth.signInWithPopup(provider)
          .then(result => {
            // Handle successful sign-in
            console.log(result.user);
          })
          .catch(error => {
            // Handle sign-in errors
            console.error(error);
          });
      }

    public signOut(): void {
        const authInstance = gapi.auth2.getAuthInstance();
        authInstance.signOut();
    }

    public isUserLoggedIn() : boolean {
        const user = this.LoggedInUser$.value;
        return (user.email != undefined);
    }

    public LogInToBackend(firstName : string, lastName : string, email : string, token : string) {
        this.post<boolean>(`auth/verify`,{
            firstName : firstName,
            lastName : lastName,
            tokenId : token,
            email : email
        }).subscribe(x => {
            if(!x) {
                this.LoggedInUser$.next({} as UserProfile);
                return;
            }
            this.LoggedInUser$.next({
                firstName : firstName,
                lastName : lastName,
                email : email
            } as UserProfile);
        });
    }
}