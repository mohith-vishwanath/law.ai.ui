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

  ngOnInit(): void {}

  openPdf(index: number): void {}

  search() {
    this.service.search(this.query).subscribe((data) => {
      console.log(data);
      this.responses = data;
    });
  }
}
