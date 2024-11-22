import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  public sections: {[key: string]: boolean} = {};
  private defaultLandingPage : string = "home"

  public username : string | undefined = undefined;

  constructor(private router: Router, private userService : UserService) {
    this.sections = {
      "search" : false,
      "chat" : false,
      "about" : false
    }

    this.userService.LoggedInUser$.subscribe(user => {
      this.username = (Object.keys(user).length == 0) ? undefined : user.firstName;
    })

  }

  ngAfterViewInit(): void {
    var section = window.location.pathname;
    console.log(section);
    if (section.startsWith("/")) section = section.split("/")[1] ?? this.defaultLandingPage;
    console.log(section);
    this.ChangeSection(section);
  }

  ngOnInit(): void { }

  public ChangeSection(section: string) {
    if(!this.username) return;
    Object.keys(this.sections).forEach(x => {
      if(x==section) this.sections[x] = true;
      else this.sections[x] = false;
    })
  }
}
