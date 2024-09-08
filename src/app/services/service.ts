import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchResponse } from '../models/response';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(private http: HttpClient) {}

  public search(query: string): Observable<SearchResponse[]> {
    console.log(`Sending query : ${query}`);
    return this.http.get<SearchResponse[]>(
      `http://127.0.0.1:8000/search?query=${query}`
    );
  }
}
