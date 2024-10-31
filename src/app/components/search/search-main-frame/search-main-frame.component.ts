import { Component, OnInit } from '@angular/core';
import { SearchResponse } from 'src/app/models/response';
import { BackendService } from 'src/app/services/service';

@Component({
  selector: 'app-search-main-frame',
  templateUrl: './search-main-frame.component.html',
  styleUrls: ['./search-main-frame.component.css']
})
export class SearchMainFrameComponent implements OnInit {

  public searchQuery : string = "";
  public searchPlaceholderText : string = "Search Anything...";
  public searchResponse : SearchResponse[] = [];

  public showResponsePage : boolean = false;

  constructor(private service : BackendService) { }

  ngOnInit(): void {}

  public search() {
    console.log(`Searching for ${this.searchQuery}`)
    this.showResponsePage = true;
    // this.service.Search(this.searchQuery.trim()).subscribe(response => {
    //   this.searchResponse = response;
    //   this.showResponsePage = true
    // })
  }

  public disableSearchButton() {
    return this.searchQuery.trim().length == 0;
  }

}
