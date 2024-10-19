import { Component, OnInit } from '@angular/core';
import { SearchResponse } from '../models/response';
import { BackendService } from '../services/service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  constructor(private service: BackendService, private router : Router) {}

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
    setTimeout(() => {
      this.responses = this.getDummyData()
      this.showLoadingIndicator = false;
    }, 900);

    // this.service.search(this.query).subscribe((data) => {
    //   console.log(data);
    //   this.responses = data;
    //   this.showLoadingIndicator = false;
    //   //Sort the cases based on cited by
    //   for(let i = 0;i< this.responses.length;i++) this.responses[i].fileLink = `https://indiankanoon.org/doc/${this.responses[i].id}/`
    // });
  }

  disableSearchButton() {
    return this.query == '' || this.query.trim().length == 0;
  }

  animate() {
    this.searchBarContainer?.classList.add('sticky-top');

    this.results?.classList.remove('hidden');
    this.results?.classList.add('visible');
  }

  private getDummyData(num = 10) : SearchResponse[] {
    let data : SearchResponse[] = [];
    for(let i =0; i < num; i++) {
      data.push({
        title: `Title ${i+1}`,
        summary: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        numcites: 11,
        fileLink: 'URL',
        relevanceScore: 0.89,
        id : 123455
      } as SearchResponse)
    }
    return data;
  }
}
