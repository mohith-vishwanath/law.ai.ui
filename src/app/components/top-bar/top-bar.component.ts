import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  private sections: string[] = [];

  constructor(private router: Router) {
    this.sections = [
      "search",
      "chat",
      "about"
    ]
  }

  ngAfterViewInit(): void {
    var section = window.location.pathname;
    if (section.startsWith("/")) section = section.split("/")[1]
    this.AddBoldToSection(section);
  }

  ngOnInit(): void { }

  public buttonClick(section: string) {
    this.AddBoldToSection(section)
  }

  private AddBoldToSection(section: string) {
    this.sections.forEach(x => {
      var element = document.getElementById(x);
      if (x == section) element?.classList.add("bold")
      else element?.classList.remove("bold")
    })
  }
}
