import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.css']
})
export class HomeScreenComponent implements OnInit {

  constructor(private dataService : DataService, private userService : UserService) { }

  ngOnInit(): void {}

  public SignInWithGoogle() {
    this.userService.LogInWithGoogle().subscribe(x => {
      console.log(`Sign in with Google response`)
      console.log(x)
    });
  }

}
