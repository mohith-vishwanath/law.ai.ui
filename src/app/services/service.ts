import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchResponse } from '../models/response';
import { HttpClient } from '@angular/common/http';
import { DocumentHistory, UploadFileResponse } from '../models/contractFile';
import { ChatMessages, Message, NewMsgRequest } from '../models/chat';
import { Case } from '../models/case';

@Injectable({ providedIn: 'root' })
export class BackendService {

  private host: string = "http://localhost:8000";

  constructor(private http: HttpClient) {
  }

  public Search(query: string): Observable<SearchResponse[]> {
    return this.http.get<SearchResponse[]>(`${this.host}/search/query?input=${query}`);
  }

  public UploadDocument(file: File, userId: string): Observable<UploadFileResponse> {
    const formData = new FormData(); // Create form data
    formData.append('file', file);
    formData.append('userId', userId);
    return this.http.post<UploadFileResponse>(`${this.host}/contract/upload`, formData);
  }

  public GetUploadedDocuments(userId: string): Observable<DocumentHistory[]> {
    return this.http.get<DocumentHistory[]>(`${this.host}/contract/documents?userId=${userId}`)
  }

  public GetChatMessageForUserWithSessionId(sessionId: string, userId: string, fileId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.host}/contract/chat-history?userId=${userId}&sessionId=${sessionId}&fileId=${fileId}`);
  }

  public SendUserMsg(request: NewMsgRequest): Observable<Message> {
    const formData = new FormData(); // Create form data
    formData.append('userId', request.userId);
    formData.append('sessionId', request.sessionId);
    formData.append('fileId', request.fileId);
    formData.append('message', request.message);
    return this.http.post<Message>(`${this.host}/contract/query`,formData);
  }

  public GetCaseText(id : number) : Observable<Case> {
    return this.http.get<Case>(`${this.host}/search/case?caseId=${id}`)
  }

  //Dummy Function to get messages
  public GetMessages(): ChatMessages {
    return {
      sessionId: "7687-192830-sdnkcj3-n3rj928",
      fileName: "Scholarship.pdf",
      messages: [
        {
          role: "assistant-message",
          content: "How can I help you today?"
        },
        {
          role: "user-message",
          content: "How can I help you today?"
        },
        {
          role: "assistant-message",
          content: "How can I help you today?"
        },
        {
          role: "user-message",
          content: "How can I help you today?"
        },
        {
          role: "assistant-message",
          content: "How can I help you today?"
        },
        {
          role: "user-message",
          content: "How can I help you today?"
        },
        {
          role: "assistant-message",
          content: "How can I help you today?"
        },
        {
          role: "user-message",
          content: "How can I help you today?"
        },
        {
          role: "assistant-message",
          content: "How can I help you today?"
        },
        {
          role: "user-message",
          content: "How can I help you today?"
        },
        {
          role: "assistant-message",
          content: "How can I help you today?"
        },
        {
          role: "user-message",
          content: "How can I help you today?"
        },
        {
          role: "assistant-message",
          content: "How can I help you today?"
        },
        {
          role: "user-message",
          content: "How can I help you today?"
        },
        {
          role: "assistant-message",
          content: "How can I help you today?"
        },
        {
          role: "user-message",
          content: "How can I help you today?"
        },
        {
          role: "assistant-message",
          content: "How can I help you today?"
        },
        {
          role: "user-message",
          content: "How can I help you today?"
        },
        {
          role: "assistant-message",
          content: "How can I help you today?"
        },
        {
          role: "user-message",
          content: "How can I help you today?"
        },
        {
          role: "assistant-message",
          content: "How can I help you today?"
        }
      ]
    } as ChatMessages;
  }

}
