import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchResponse } from '../models/response';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(private http: HttpClient) {}

  public search(query: string): Observable<SearchResponse[]> {
    console.log(`Sending query : ${query}`);
    return this.http.get<SearchResponse[]>(
      `${environment.baseUrl}/search?query=${query}`
    );
  }
}
