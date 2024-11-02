import { Injectable } from "@angular/core";
import { DocumentHistory, UploadFileResponse } from "../models/contractFile";
import { BehaviorSubject, Observable, of } from "rxjs";
import { BackendService } from "./service";
import { NewMsgRequest } from "../models/chat";
import { map, switchMap } from "rxjs/operators";
import { marked } from "marked";
import { Case } from "../models/case";
import { SearchResponse } from "../models/response";

@Injectable({providedIn : "root"})
export class DataService {

    public CurrentConversation$ = new BehaviorSubject<DocumentHistory>({} as DocumentHistory);
    public UserDocumentsHistory$ = new BehaviorSubject<DocumentHistory[]>([]);

    private UploadedDocuments$ = new BehaviorSubject<void>(undefined);

    private SearchResults$ = new BehaviorSubject<SearchResponse[]>([]);

    private RawCases: { [id: number]: Case } = {};

    public userId : string = "0b8d66b8-00dd-4abd-b530-6125b4bcc09f";

    constructor(private service : BackendService) {

        this.UploadedDocuments$.pipe(
            switchMap(() => this.service.GetUploadedDocuments(this.userId))
        ).subscribe(res => this.UserDocumentsHistory$.next(res));
    }

    public SetUserId(id : string) : boolean {
        this.userId = id;
        return true;
    }

    public GetUserId() : string {
        return this.userId;
    }

    public AddNewDocumentToUserDocumentHistory(document : DocumentHistory) : boolean {
        this.UserDocumentsHistory$.next([
            ...this.UserDocumentsHistory$.value,
            document
        ])
        return true;
    }

    public ChangeCurrentConversation(conversation : DocumentHistory) : boolean {
        this.service.GetChatMessageForUserWithSessionId(conversation.sessionId,this.userId,conversation.fileId).subscribe(res => {
            this.CurrentConversation$.next({
                ...conversation,
                chats : res
            });
        })
        return true;
    }

    public GetCurrentConversation() : Observable<DocumentHistory> {
        return this.CurrentConversation$.asObservable();
    }

    public GetUserDocumentHistory() : Observable<DocumentHistory[]> {
        return this.UserDocumentsHistory$.asObservable();
    }

    public GetSearchResults() : Observable<SearchResponse[]> {
        return this.SearchResults$.asObservable();
    }

    public AddMsgToCurrentConversation(message : string) {

        this.CurrentConversation$.next({
            ...this.CurrentConversation$.value,
            chats : [
                ...this.CurrentConversation$.value.chats,
                {
                    role : "user",
                    content : message
                }
            ]
        });

        //Send the message to backend
        this.service.SendUserMsg({
            sessionId : this.CurrentConversation$.value.sessionId,
            fileId : this.CurrentConversation$.value.fileId,
            userId : this.userId,
            message : message
        } as NewMsgRequest).subscribe(res => {

            this.CurrentConversation$.next({
                ...this.CurrentConversation$.value,
                chats : [
                    ...this.CurrentConversation$.value.chats,
                    res
                ]
            });
        })
    }

    public UploadDocument(file : File) : Observable<UploadFileResponse> {
        return this.service.UploadDocument(file,this.userId).pipe(
            map((res) => {
                this.UploadedDocuments$.next();
                return res;
            })
        );
    }

    public GetCaseWithCaseId(caseId : number) : Observable<Case> {
        if (caseId in this.RawCases) return of(this.RawCases[caseId])
        else return this.service.GetCaseText(caseId).pipe(map(res => {
            this.RawCases[caseId] = res;
            return res;
        }));
    }

    public Search(query : string) : void {
        this.service.Search(query).subscribe(data => this.SearchResults$.next(data))
    }
}