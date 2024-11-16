import { Injectable } from "@angular/core";
import { BackendService } from "./service";
import { BehaviorSubject } from "rxjs";
import { UserProfile } from "../models/user";

@Injectable({ providedIn: "root" })
export class UserService {

    constructor(private service : BackendService) {}

    public LoggedInUser$ = new BehaviorSubject<UserProfile>({} as UserProfile);

    public LogInWithGoogle() {
        return this.service.LogInWithGoogle();
    }

}