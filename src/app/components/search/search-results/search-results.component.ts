import { Component, Input, OnInit } from '@angular/core';
import { Case } from 'src/app/models/case';
import { SearchResponse } from 'src/app/models/response';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  @Input('searchQuery') searchQuery : string = "";
  public results : SearchResponse[] = []

  public isSideNavOpen : boolean = false;
  public showCasePreview : boolean = false;
  public searchPlaceholderText : string = "Ask Anything...";

  public case : Case | undefined = undefined;
  
  constructor(private dataService : DataService) { }

  ngOnInit(): void {
    this.dataService.GetSearchResults().subscribe(data => {
      if(data) {
        this.results = data;
      }
    })
  }

  public ToggleSidenav() {
    this.isSideNavOpen = !this.isSideNavOpen;
  }

  public DisableSearchButton() {
    return this.searchQuery.trim().length == 0;
  }

  public Search() {
    this.dataService.Search(this.searchQuery)
  }

  public OpenCase(index : number) {
    //Get the case ID
    var caseId = this.results[index].id;

    this.dataService.GetCaseWithCaseId(caseId).subscribe(res => {
      this.showCasePreview = true;
      this.case = res;
      console.log(this.case)
    })
    
  }

}
