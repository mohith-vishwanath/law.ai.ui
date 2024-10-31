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
  @Input('results') results : SearchResponse[] = []

  public isSideNavOpen : boolean = false;
  public showCasePreview : boolean = false;
  public searchPlaceholderText : string = "Ask Anything...";

  public case : Case | undefined = undefined;
  
  constructor(private dataService : DataService) { }

  ngOnInit(): void {
    // //Dummy case
    // for(let i = 0; i< 20; i++) {
    //   this.results.push({
    //     title : `Title ${i}`,
    //     summary : "In summary, the case involves a dispute over the validity of a caste certificate issued to respondent No. 15, claiming Scheduled Tribe status. The certificate was issued in 1993, but there were conflicting affidavits and sale deeds suggesting respondent No. 15's father belonged to the general category. The caste certificate was eventually cancelled by the SDO in 2012, but the cancellation was overturned by a committee. The High Court upheld the committee's jurisdiction, leading to the appeal. The Supreme Court set aside the High Court's decision, finding that the committee lacked jurisdiction and that the conduct of respondent No. 15 indicated that the appeal was meritless.",
    //     numcites : 5,
    //     fileLink : "https://www.apple.com",
    //     relevanceScore : 0.78,
    //     id : i,
    //     date : ""
    //   } as SearchResponse)
    // }
  }

  public ToggleSidenav() {
    this.isSideNavOpen = !this.isSideNavOpen;
  }

  public DisableSearchButton() {
    return this.searchQuery.trim().length == 0;
  }

  public Search() {
    this
  }

  public OpenCase(index : number) {
    //Get the case ID
    var caseId = this.results[index].id;

    this.dataService.GetCaseWithCaseId(133800809).subscribe(res => {
      this.showCasePreview = true;
      this.case = res;
      console.log(this.case)
    })
    
  }

}
