import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SearchResponse } from '../models/response';
import { HttpClient } from '@angular/common/http';
import { Sessions, UploadFileResponse } from '../models/contractFile';
import { AddFileOrCaseToSessionResponse, ChatMessages, Message, NewMsgRequest } from '../models/chat';
import { Case, CaseSummary } from '../models/case';
import { delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class BackendService {

  private host: string = "";

  constructor(private http: HttpClient) {
    this.host = environment.baseUrl;
  }

  private post<T>(url : string, body : any) : Observable<T> {
    return this.http.post<T>(`${this.host}/${url}`,body,{withCredentials : true})
  }

  private get<T>(url : string) : Observable<T> {
    return this.http.get<T>(`${this.host}/${url}`,{withCredentials : true})
  }

  private delete<T>(url : string) : Observable<T> {
    return this.http.delete<T>(`${this.host}/${url}`);
  }

  public Search(query: string): Observable<SearchResponse> {
    // return of({} as SearchResponse).pipe(delay(10000));
    return this.get<SearchResponse>(`search/query?input=${query}`);
  }

  public AddFilesToSession(file: File, sessionId : string): Observable<AddFileOrCaseToSessionResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sessionId', sessionId);
    return this.post<AddFileOrCaseToSessionResponse>(`chat/upload/document`, formData);
  }

  public AddCasesToSession(sessionId: string, cases: string): Observable<AddFileOrCaseToSessionResponse> {
    const payload = {
      sessionId: sessionId,
      cases: cases
    };
    return this.post<AddFileOrCaseToSessionResponse>(`chat/upload/cases`, payload);
  }
  

  public GetUserChatHistory(): Observable<Sessions[]> {
    return this.get<Sessions[]>(`chat/sessions`)
  }

  public GetMessagesForUserWithSessionId(sessionId: string): Observable<Message[]> {
    return this.get<Message[]>(`chat/chat-history?sessionId=${sessionId}`);
  }

  public SendUserMsg(request: NewMsgRequest): Observable<Message> {
    const formData = new FormData(); // Create form data
    formData.append('sessionId', request.sessionId);
    formData.append('message', request.message);
    return this.post<Message>(`chat/query`,formData);
  }

  public GetCaseText(id : number) : Observable<Case> {
    return this.get<Case>(`search/case?caseId=${id}`)
  }

  public GetCaseSummary(id : number) : Observable<CaseSummary> {
    return this.get<CaseSummary>(`search/summary?caseId=${id}`);
  }

  public LogInWithGoogle() {
    return this.get(`${this.host}/auth/google`)
  }

  public DeleteSession(sessionId : string) : Observable<boolean> {
    return this.delete<boolean>(`chat/delete/session?sessionId=${sessionId}`);
  }
}
