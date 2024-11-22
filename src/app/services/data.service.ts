import { Injectable } from "@angular/core";
import { Files, Sessions } from "../models/contractFile";
import { BehaviorSubject, Observable, of } from "rxjs";
import { BackendService } from "./service";
import { AddFileOrCaseToSessionResponse, Message, NewMsgRequest } from "../models/chat";
import { filter, first, map, switchMap, take } from "rxjs/operators";
import { marked } from "marked";
import { Case, CaseSummary } from "../models/case";
import { SearchMetadata, SearchResponse } from "../models/response";

@Injectable({ providedIn: "root" })
export class DataService {

    public SessionsHistory$ = new BehaviorSubject<Sessions[]>([]);
    public SearchMetadata$ = new BehaviorSubject<SearchMetadata>({} as SearchMetadata);

    public CurrentSession$ = new Observable<Sessions | undefined>(undefined);

    constructor(private service: BackendService) {

        this.CurrentSession$ = this.SessionsHistory$
        .pipe(map(data =>  data?.find(x => x.isSelected))
)
    }

    private GetCurrentSessionId() : string {
        return this.SessionsHistory$.value.find(x => x.isSelected)?.sessionId ?? "";
    }

    public FetchSessionsHistory(): void {
        this.service.GetUserChatHistory()
        .pipe(first())
        .subscribe(res => {
            var result = [];
            var newChatCount = 1;
            for (let i = 0; i < res.length; i++) {

                // if(i == 0 && !res[i].chats)

                result.push({
                    sessionId: res[i].sessionId,
                    chats: res[i].chats,
                    files: res[i].files,
                    isSelected: i == 0,
                    title: res[i].title ?? `New Chat ${newChatCount++}`,
                    questions: res[i].questions
                } as Sessions)
            }
            if(result.length != 0) this.SessionsHistory$.next(result);
        })
    }

    public AddDocumentToSession(file : File) : void {
        this.service.AddFilesToSession(file,this.GetCurrentSessionId())
        .pipe(first())
        .subscribe(res => {
            if (!res) return;
            var history = this.SessionsHistory$.value;
            history.forEach(x => {
                if (x.isSelected) {
                    x.sessionId = res.sessionId;
                    x.questions = res.questions;
                    if (!x.title) x.title = res.title;
                }
            });
            this.SessionsHistory$.next(history);
        });
    }

    public ChangeCurrentConversationTo(changeToIndex: number) : void {

        console.log(`ChangeCurrentConversationToIndex -> ${changeToIndex}`)

        var history = this.SessionsHistory$.value;
        var currentIndex = history.findIndex(x => x.isSelected);

        if (currentIndex != -1) history[currentIndex].isSelected = false;
        history[changeToIndex].isSelected = true;

        if(history[changeToIndex].chats) {
            this.SessionsHistory$.next(history);
            return;
        }

        if (!history[changeToIndex].chats && history[changeToIndex].sessionId != "") this.GetChatHistoryForSessionId(history[changeToIndex].sessionId)
        this.SessionsHistory$.next(history);
    }

    public GetChatHistoryForSessionId(sessionId : string) : void {
        this.service.GetMessagesForUserWithSessionId(sessionId)
        .pipe(first())
        .subscribe(data => {
            if (!data) return;
            //Add the chats to the right document
            var history = this.SessionsHistory$.value;
            var index = history.findIndex(x => x.sessionId == sessionId);
            if (index == -1) return;
            history[index].chats = data;
            console.log(data);
            this.SessionsHistory$.next(history);
        })
    }

    public AddMsgToCurrentSession(message: string) {

        //Find the current conversation
        var history = this.SessionsHistory$.value;
        var currentIndex = history.findIndex(x => x.isSelected);

        const messageObj = {
            role: "user",
            content: message
        }

        if (!history[currentIndex].chats) history[currentIndex].chats = [];

        history[currentIndex].chats?.push(messageObj);

        this.SessionsHistory$.next(history);

        const sessionId = history[currentIndex].sessionId;

        this.service.SendUserMsg({
            sessionId: sessionId,
            message: message
        })
        .pipe(first())
        .subscribe(data => {
            if (data) {
                var history = this.SessionsHistory$.value;
                var index = history.findIndex(x => x.sessionId == sessionId);
                if (!history[index].chats) history[index].chats = [];
                history[index].chats?.push(data)
                this.SessionsHistory$.next(history);
            }
        })
    }

    public UploadDocument(file: File): void {
        this.service.AddFilesToSession(file,this.GetCurrentSessionId())
        .pipe(first())
        .subscribe(data => {
            var history = this.SessionsHistory$.value;
            const currentSelection = history.findIndex(x => x.isSelected);
            console.log(history);
            history[currentSelection].sessionId = data.sessionId;
            history[currentSelection].questions = data.questions;
            history[currentSelection].files = data.filesInSession;
            history[currentSelection].title = data.title;
            this.SessionsHistory$.next(history);
        })
    }

    public GetSummaryForCaseId(caseId: number): Observable<CaseSummary> {
        return this.service.GetCaseSummary(caseId).pipe(first());
    }

    public GetCaseText(caseId: number): Observable<Case> {
        return this.service.GetCaseText(caseId).pipe(first());
    }

    public Search(query: string): Observable<SearchResponse> {
        if (query.trim() == "") return of({} as SearchResponse);
        return this.service.Search(query).pipe(first());
    }

    public CreateNewChatSession(title: string = "New Chat") {
        var history = this.SessionsHistory$.value || [];

        history.forEach(x => x.isSelected = false);

        history.push({
            title: title,
            sessionId: "",
            chats: undefined,
            files: undefined,
            isSelected: true,
            questions: undefined
        } as Sessions)

        this.SessionsHistory$.next(history);
        console.log("NEW CHAT")
        console.log(this.SessionsHistory$.value);
    }

    public AddCasesToSession(cases: string): Observable<boolean> {
        const sessionId = this.SessionsHistory$.value.find(x => x.isSelected)?.sessionId ?? "";
        return this.service.AddCasesToSession(sessionId, cases).pipe(
            first(),
            map((data) => {
                //Add a new chat
                var history = this.SessionsHistory$.value;
                //Mark any selected chats as FALSE
                history.forEach(x => x.isSelected = false);
                history.push({
                    title: data.title, //Put the current query for now
                    sessionId: data.sessionId,
                    chats: undefined,
                    files: data.filesInSession,
                    isSelected: true,
                    questions: data.questions
                } as Sessions)
                this.SessionsHistory$.next(history);
                return true;
            })
        );
    }

    public DeleteSession(sessionId : string) : Observable<boolean> {
        return this.service.DeleteSession(sessionId);
    }

}