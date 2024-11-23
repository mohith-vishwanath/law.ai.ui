import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { UserProfile } from "../models/user";
import { HttpClient } from "@angular/common/http";
import { first } from "rxjs/operators";
import { environment } from "src/environments/environment";


declare var gapi: any; // Declare the gapi object from Google's platform.js

@Injectable({ providedIn: "root" })
export class UserService {

    private host: string = "";
    public isGoogleSignInEnabled$ = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {
        this.host = environment.baseUrl;
    }

    private post<T>(url: string, body: any): Observable<T> {
        return this.http.post<T>(`${this.host}/${url}`, body, { withCredentials: true })
    }

    private get<T>(url: string): Observable<T> {
        return this.http.get<T>(`${this.host}/${url}`, { withCredentials: true })
    }

    public LoggedInUser$ = new BehaviorSubject<UserProfile>({} as UserProfile);

    public CheckLogin() {
        this.get<UserProfile | undefined>(`auth/check`)
            .pipe(first())
            .subscribe(user => {
                if (user) {
                    console.log(`User already logged in! ${user.firstName} ${user.lastName}`);
                    this.LoggedInUser$.next(user);
                }
            });
    }


    public SignUp(firstName: string, lastName: string, email: string, password: string): void {
        this.post<boolean>(`auth/create`, {
            firstName, lastName, email, password
        })
            .pipe(first())
            .subscribe(response => {
                var user = {} as UserProfile;
                if (response) {
                    user = {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        token: ""
                    }
                }
                this.LoggedInUser$.next(user);
            });
    }

    public IsUserLoggedIn(): boolean {
        return this.LoggedInUser$.value.email != undefined;
    }

}