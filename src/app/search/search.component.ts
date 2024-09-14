import { Component, OnInit } from '@angular/core';
import { SearchResponse } from '../models/response';
import { SearchService } from '../services/service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  constructor(private service: SearchService) {}

  public query: string = '';

  public responses: SearchResponse[] = [];

  public count: number = 1;

  public searchBarContainer: Element | null = null;
  public results: Element | null = null;

  public showLoadingIndicator: boolean = false;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.searchBarContainer = document.querySelector('.search-bar');
    this.results = document.querySelector('.results');
  }

  openPdf(index: number): void {}

  search() {
    this.showLoadingIndicator = true;
    this.responses = [];
    this.animate();
    // setTimeout(() => {
    //   this.responses.push({
    //     title: `Title ${this.count++}`,
    //     summary: 'Description',
    //     citedBy: 11,
    //     fileLink: 'URL',
    //     relevanceScore: 0.89,
    //   });
    //   this.showLoadingIndicator = false;
    // }, 900);

    this.service.search(this.query).subscribe((data) => {
      console.log(data);
      this.responses = data;
      this.showLoadingIndicator = false;
    });
  }

  disableSearchButton() {
    return this.query == '' || this.query.trim().length == 0;
  }

  animate() {
    this.searchBarContainer?.classList.add('sticky-top');

    this.results?.classList.remove('hidden');
    this.results?.classList.add('visible');
  }
}
