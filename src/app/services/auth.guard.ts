import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service'; // Replace with your actual service path

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): boolean {
    if (this.userService.IsUserLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
