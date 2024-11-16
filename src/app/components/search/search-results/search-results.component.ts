import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, first } from 'rxjs/operators';
import { Case } from 'src/app/models/case';
import { SearchMetadata, SearchResponse } from 'src/app/models/response';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  @Input('searchQuery') searchQuery: string = "";
  public results: {[id : number] : Case} = {};

  public isSideNavOpen: boolean = false;
  public showCasePreview: boolean = false;
  public showCaseSummary: boolean = false;
  public isSearchLoading : boolean = true;
  public searchPlaceholderText: string = "Ask Anything...";
  public searchLoadingMessage : string = "Searching database";

  public numOfSelectedCases : number = 0;

  public isAnyCaseChecked : boolean = false;

  public searchMetadata : SearchMetadata = {} as SearchMetadata;

  public selectedCaseId : number = -1;

  constructor(private dataService: DataService, private router : Router) { }

  ngOnInit(): void {
    this.dataService.SearchMetadata$.pipe(filter(x => x.type != undefined)).subscribe(data => {
      this.searchMetadata = data;
    })
    this.dataService.SearchCases$.subscribe(data => {
      // if(this.selectedCaseId != -1) this.showCaseSummary = true;
        this.results = data;
        console.log(this.results)
        if(Object.keys(data).length != 0) this.isSearchLoading = false
    });
  }

  get GetListOfCases() {
    return Object.entries(this.results).sort((a,b) => b[1].score - a[1].score);
  }

  public ToggleSidenav() {
    this.isSideNavOpen = !this.isSideNavOpen;
  }

  public DisableSearchButton() {
    return this.searchQuery.trim().length == 0;
  }

  public Search() {
    this.selectedCaseId = -1;
    this.isSearchLoading = true;
    this.dataService.Search(this.searchQuery)
  }

  public ShowSummary(id: string) {
    var caseId = Number(id);
    console.log(`Current CaseID -> ${id}`);
    this.selectedCaseId = caseId;
    this.showCasePreview = false;
    this.showCaseSummary = true;
    // if (!this.results[caseId].summary?.summary) this.dataService.GetSummaryForCaseId(caseId);
    // else this.showCaseSummary = true;
  }

  public OpenCase() {
    this.showCaseSummary = false;
    this.showCasePreview = true;
    if(!this.results[this.selectedCaseId].html) this.dataService.GetCaseText(this.selectedCaseId);
  }

  public CloseSummary() {
    this.selectedCaseId = -1;
    this.showCaseSummary = false;
  }

  // public CheckBoxEvent(checked : boolean, caseId : string) {
  //   console.log(`Checked : ${checked} | CaseId : ${caseId}`)
  // }

  CheckboxClicked(event: Event, id: string) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.results[Number(id)].isChecked = !this.results[Number(id)].isChecked;
    this.numOfSelectedCases = 0;
    Object.values(this.results).forEach(x => x.isChecked ? this.numOfSelectedCases++ : undefined);
    this.isAnyCaseChecked = this.numOfSelectedCases > 0;
  }
  
  public MoveCasesToChat() {
    var cases = "";
    Object.values(this.results).filter(x => x.isChecked)?.forEach(x => cases += `${x.id},`);
    cases = cases.slice(0,-1);
    this.dataService.AddCasesToSession(cases).subscribe(response => {
      this.router.navigateByUrl("/chat");
    });
  }

}
