import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SearchResponse } from '../models/response';
import { HttpClient } from '@angular/common/http';
import { Sessions, UploadFileResponse } from '../models/contractFile';
import { AddFileOrCaseToSessionResponse, ChatMessages, Message, NewMsgRequest } from '../models/chat';
import { Case, CaseSummary } from '../models/case';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BackendService {

  private host: string = "http://localhost:8000";

  constructor(private http: HttpClient) {}

  public Search(query: string): Observable<SearchResponse> {
    // return of({} as SearchResponse).pipe(delay(10000));
    return this.http.get<SearchResponse>(`${this.host}/search/query?input=${query}`);
  }

  public AddFilesToSession(file: File, userId: string, sessionId : string): Observable<AddFileOrCaseToSessionResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    formData.append('sessionId', sessionId);
    return this.http.post<AddFileOrCaseToSessionResponse>(`${this.host}/chat/upload/document`, formData);
  }

  public AddCasesToSession(userId: string, sessionId: string, cases: string): Observable<AddFileOrCaseToSessionResponse> {
    const payload = {
      userId: userId,
      sessionId: sessionId,
      cases: cases
    };
    return this.http.post<AddFileOrCaseToSessionResponse>(`${this.host}/chat/upload/cases`, payload);
  }
  

  public GetUserChatHistory(userId: string): Observable<Sessions[]> {
    return this.http.get<Sessions[]>(`${this.host}/chat/sessions?userId=${userId}`)
  }

  public GetMessagesForUserWithSessionId(sessionId: string, userId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.host}/chat/chat-history?userId=${userId}&sessionId=${sessionId}`);
  }

  public SendUserMsg(request: NewMsgRequest): Observable<Message> {
    const formData = new FormData(); // Create form data
    formData.append('userId', request.userId);
    formData.append('sessionId', request.sessionId);
    formData.append('message', request.message);
    console.log(formData);
    return this.http.post<Message>(`${this.host}/chat/query`,formData);
  }

  public GetCaseText(id : number) : Observable<Case> {
    return this.http.get<Case>(`${this.host}/search/case?caseId=${id}`)
  }

  public GetCaseSummary(id : number) : Observable<CaseSummary> {
    return this.http.get<CaseSummary>(`${this.host}/search/summary?caseId=${id}`);
  }

  public LogInWithGoogle() {
    return this.http.get(`${this.host}/auth/google`,{withCredentials : true})
  }

  public DeleteSession(userId : string, sessionId : string) : Observable<boolean> {
    return this.http.delete<boolean>(`${this.host}/chat/delete/session?userId=${userId}&sessionId=${sessionId}`);
  }

}
