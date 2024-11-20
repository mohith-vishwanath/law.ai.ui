import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { marked } from 'marked';
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
  public results: Case[] = [];

  public isSideNavOpen: boolean = false;
  public showCasePreview: boolean = false;
  public showCaseSummary: boolean = false;
  public isSearchLoading: boolean = true;
  public searchPlaceholderText: string = "Ask Anything...";
  public searchLoadingMessage: string = "Searching database";

  public numOfSelectedCases: number = 0;

  public isAnyCaseChecked: boolean = false;

  public searchMetadata: SearchMetadata = {} as SearchMetadata;

  public selectedCase: Case | undefined = undefined;

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.dataService.Search(this.searchQuery).subscribe(this.HandleSearchResponse.bind(this))
  }

  private async HandleSearchResponse(data: SearchResponse) {
    this.searchMetadata = {
      type: data.type == "vs" ? "Semantic Search" : "Keyword Search",
      summary: marked(data.summary).toString()
    }
    this.results = []
    for (let c of data.cases) {
      if (typeof c.summary.Arguments === "object" && c.summary.Arguments !== null) {
        let result = '';
        for (const [key, value] of Object.entries(c.summary.Arguments)) {
            result += `**${key}** : ${value}\n`;
        }
        c.summary.Arguments = result;
    }

      this.results.push({
        id: c.id,
        title: c.title,
        source: c.source,
        numcites: c.numcites,
        date: c.date,
        summary: {
          Summary: marked(c.summary.Summary ?? "").toString(),
          Arguments: marked(c.summary.Arguments ?? "").toString(),
          Facts: marked(c.summary.Facts ?? "").toString(),
          Reasoning: marked(c.summary.Reasoning ?? "").toString(),
          Conclusion: marked(c.summary.Conclusion ?? "").toString(),
          Laws: marked(c.summary.Laws ?? "").toString(),
        },
        isChecked: false,
        score: c.score
      } as Case)
    }
    this.isSearchLoading = false;
  }

  public ToggleSidenav() {
    this.isSideNavOpen = !this.isSideNavOpen;
  }

  public DisableSearchButton() {
    return this.searchQuery.trim().length == 0;
  }

  public Search() {
    this.selectedCase = undefined;
    this.isSearchLoading = true;
    this.numOfSelectedCases = 0;
    this.dataService.Search(this.searchQuery).subscribe(this.HandleSearchResponse.bind(this))
  }

  public ShowSummary(id: number) {
    this.selectedCase = this.results.find(x => x.id == id);
    this.showCasePreview = false;
    this.showCaseSummary = true;
    // if (!this.results[caseId].summary?.summary) this.dataService.GetSummaryForCaseId(caseId);
    // else this.showCaseSummary = true;
  }

  public OpenCase() {
    this.showCaseSummary = false;
    this.showCasePreview = true;

    if(this.selectedCase && !this.selectedCase.html) {
      this.dataService.GetCaseText(this.selectedCase.id).subscribe(data => {
        this.results = this.results.map(x => x.id == this.selectedCase?.id ? {...x,html : data.html} : x)
        this.selectedCase = this.results.find(x => x.id == this.selectedCase?.id)
      });
    }
  }

  public CloseSummary() {
    this.selectedCase = undefined;
    this.showCaseSummary = false;
  }

  CheckboxClicked(event: Event, id: number) {
    console.log(`Checked ${id}`)
    this.results = this.results.map(x => x.id == id ? { ...x, isChecked: !x.isChecked } : x);
    this.numOfSelectedCases = 0;
    Object.values(this.results).forEach(x => x.isChecked ? this.numOfSelectedCases++ : undefined);
    this.isAnyCaseChecked = this.numOfSelectedCases > 0;
  }

  public MoveCasesToChat() {
    var cases = "";
    Object.values(this.results).filter(x => x.isChecked)?.forEach(x => cases += `${x.id},`);
    cases = cases.slice(0, -1);
    this.dataService.AddCasesToSession(cases).subscribe(response => {
      this.router.navigateByUrl("/chat");
    });
  }

}
