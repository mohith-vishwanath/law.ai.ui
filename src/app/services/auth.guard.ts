import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service'; // Replace with your actual service path

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): boolean {
    if (this.userService.isUserLoggedIn()) {
      // Allow access if the user is logged in
      return true;
    } else {
      // Redirect to the login page or any other route
      this.router.navigate(['/']);
      return false;
    }
  }
}
