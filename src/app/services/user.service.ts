import { Injectable } from "@angular/core";
import { BackendService } from "./service";
import { BehaviorSubject } from "rxjs";
import { UserProfile } from "../models/user";


declare var gapi: any; // Declare the gapi object from Google's platform.js

@Injectable({ providedIn: "root" })
export class UserService {

    constructor(private service: BackendService) {
        setTimeout(() => {
            this.loadGapi();
        }, 3000);
    }

    public LoggedInUser$ = new BehaviorSubject<UserProfile>({} as UserProfile);
    private clientId: string = '472133833229-408gndosjbnehcvsojua17ijave19l6c.apps.googleusercontent.com'; // Replace with your actual client ID

    private loadGapi(): void {
        gapi.load('auth2', () => {
            gapi.auth2.init({
                client_id: this.clientId,
                scope: "email",
                plugin_name: "theprecedent"
            });
        });
    }


    public SignInWithGoogle(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (typeof gapi === 'undefined') this.loadGapi();
            const authInstance = gapi.auth2.getAuthInstance();
            authInstance.signIn({ prompt: "consent" }).then(
                (googleUser: any) => {
                    const profile = googleUser.getBasicProfile();
                    const user = {
                        firstName : profile.getGivenName(),
                        lastName : profile.getFamilyName(),
                        email : profile.getEmail(),
                        token : googleUser.getAuthResponse().id_token
                    } as UserProfile;
                    this.LoggedInUser$.next(user);
                    resolve(googleUser);
                },
                (error: any) => {
                    reject(error);
                }
            );
        });
    }

    public signOut(): void {
        const authInstance = gapi.auth2.getAuthInstance();
        authInstance.signOut();
    }

    public isUserLoggedIn() : boolean {
        return this.LoggedInUser$.value.token != undefined;
    }

}