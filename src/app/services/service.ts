import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchResponse } from '../models/response';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UploadFileResponse } from '../models/contractFile';

@Injectable({ providedIn: 'root' })
export class BackendService {
  constructor(private http: HttpClient) {}

  private host : string = "http://localhost:8000";

  public search(query: string): Observable<SearchResponse[]> {
    return this.http.get<SearchResponse[]>(
      `${this.host}/search?input=${query}`
    );
  }

  public uploadDocument(file : File) : Observable<UploadFileResponse> {
    const formData = new FormData(); // Create form data
    formData.append('file', file); 
    return this.http.post<UploadFileResponse>(`${this.host}/contract-upload`, formData);
  }
}
