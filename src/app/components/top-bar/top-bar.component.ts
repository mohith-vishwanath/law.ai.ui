import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  public sections: {[key: string]: boolean} = {};
  private defaultLandingPage : string = "search"

  constructor(private router: Router) {
    this.sections = {
      "home" : false,
      "search" : true,
      "chat" : false,
      "about" : false
    }
  }

  ngAfterViewInit(): void {
    var section = window.location.pathname;
    if (section.startsWith("/")) section = section.split("/")[1] ?? this.defaultLandingPage;
    this.ChangeSection(section);
  }

  ngOnInit(): void { }

  public ChangeSection(section: string) {
    Object.keys(this.sections).forEach(x => {
      if(x==section) this.sections[x] = true;
      else this.sections[x] = false;
    })
  }
}
