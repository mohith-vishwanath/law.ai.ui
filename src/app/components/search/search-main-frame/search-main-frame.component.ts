import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SearchResponse } from 'src/app/models/response';
import { DataService } from 'src/app/services/data.service';
import { BackendService } from 'src/app/services/service';
import { SplashScreenComponent } from '../../splash-screens/splash-screen/splash-screen.component';

@Component({
  selector: 'app-search-main-frame',
  templateUrl: './search-main-frame.component.html',
  styleUrls: ['./search-main-frame.component.css']
})
export class SearchMainFrameComponent implements OnInit {

  public searchQuery: string = "";
  public searchPlaceholderText: string = "Search Anything...";
  public searchResponse: SearchResponse[] = [];

  public showResponsePage: boolean = false;
  public keywordSearchLabel: string = "Keyword Search"

  public isSmartKeywordSearchEnabled : boolean = false;

  constructor(private dataService: DataService, private dialog: MatDialog) { }

  ngOnInit(): void {

    // const dialogRef = this.dialog.open(SplashScreenComponent);
  
    //   dialogRef.afterClosed().subscribe(result => {
    //     console.log(`Dialog result: ${result}`);
    //   });
   }

  public search() {
    this.showResponsePage = true;
  }

  public disableSearchButton() {
    return this.searchQuery.trim().length == 0;
  }

  public onInputChange(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    if(input.length == 1) return;
    const element = document.getElementById("info-label");
    if ((input.startsWith('"') && input.endsWith('"')) || (input.startsWith("'") && input.endsWith("'"))) {
      if (element?.classList.contains("fade-out")) element.classList.remove("fade-out");
      if (!element?.classList.contains("fade-in")) element?.classList.add("fade-in");
    } else {
      if (element?.classList.contains("fade-in")) element?.classList.remove("fade-in");
      if (!element?.classList.contains("fade-out")) element?.classList.add("fade-out");
    }
  }

}
