import { Injectable } from "@angular/core";
import { Files, Sessions } from "../models/contractFile";
import { BehaviorSubject, Observable, of } from "rxjs";
import { BackendService } from "./service";
import { AddFileOrCaseToSessionResponse, Message, NewMsgRequest } from "../models/chat";
import { filter, first, map, switchMap, take } from "rxjs/operators";
import { marked } from "marked";
import { Case, CaseSummary } from "../models/case";
import { SearchMetadata, SearchResponse } from "../models/response";
import { v4 } from "uuid";

@Injectable({ providedIn: "root" })
export class DataService {

    private SearchQueryPipeline$ = new BehaviorSubject<string>("");
    private GetAllUserSessionsPipeline$ = new BehaviorSubject<void>(undefined);
    private GetSessionHistoryForUserPipeline$ = new BehaviorSubject<string>("");
    private UploadDocumentsPipeline$ = new BehaviorSubject<File>({} as File);
    private SendMessagePipeline$ = new BehaviorSubject<NewMsgRequest>({} as NewMsgRequest);

    public UserSessionsHistory$ = new BehaviorSubject<Sessions[]>([]);
    public CurrentSession$ = new Observable<Sessions | undefined>();
    public SearchMetadata$ = new BehaviorSubject<SearchMetadata>({} as SearchMetadata);

    public SearchCases$ = new BehaviorSubject<{ [id: number]: Case }>({});

    private userId: string = "0b8d66b8-00dd-4abd-b530-6125b4bcc09f";
    private currentSessionId: string = "";


    constructor(private service: BackendService) {

        this.CurrentSession$ = this.UserSessionsHistory$.pipe(map(data => {
            var selected = data.find(x => x.isSelected);
            this.currentSessionId = selected?.sessionId ?? "";
            return selected;
        }));

        this.SearchQueryPipeline$.pipe(
            switchMap(query => query.trim() == "" ? of(undefined) : this.service.Search(query))
        ).pipe(filter(data => data != undefined)).subscribe(results => {
            var searchResult: { [id: number]: Case } = {};
            for (let result of (results?.cases || [])) {
                searchResult[result.id] = {
                    id: result.id,
                    title: result.title,
                    source: result.source,
                    numcites: result.numcites,
                    date: result.date,
                    summary: {
                        Summary : marked(result.summary.Summary ?? "").toString(),
                        Arguments : marked(result.summary.Arguments ?? "").toString(),
                        Facts : marked(result.summary.Facts ?? "").toString(),
                        Reasoning : marked(result.summary.Reasoning ?? "").toString(),
                        Conclusion : marked(result.summary.Conclusion ?? "").toString(),
                        Laws : marked(result.summary.Laws ?? "").toString(),
                    },
                    isChecked : false,
                    score: result.score
                } as Case;
            }
            this.SearchMetadata$.next({
                type: results?.type == "kws" ? "Keyword Search" : "Semantic Search",
                summary : marked(results?.summary ?? "").toString()
            });
            this.SearchCases$.next(searchResult);
        });

        this.GetAllUserSessionsPipeline$.pipe(
            switchMap(req => this.service.GetUserChatHistory(this.userId))
        ).subscribe(res => {
            var result = this.UserSessionsHistory$.value;
            var newChatCount = 1;
            for (let i = 0; i < res.length; i++) {
                result.push({
                    sessionId: res[i].sessionId,
                    chats: undefined,
                    files: undefined,
                    isSelected: false,
                    title: res[i].title ?? `New Chat ${newChatCount++}`,
                    questions: []
                } as Sessions)
            }
            this.UserSessionsHistory$.next(result);
        });

        this.UploadDocumentsPipeline$.pipe(
            switchMap(req => req?.name ? this.service.AddFilesToSession(req, this.userId, this.currentSessionId) : of(undefined))
        ).subscribe(res => {
            if (!res) return;
            var history = this.UserSessionsHistory$.value;

            //check if the current selected session has EMPTY sesion ID
            history.forEach(x => {
                if (x.isSelected) {
                    x.sessionId = res.sessionId;
                    x.questions = res.questions;
                    if (!x.title) x.title = res.title;
                }
            });
            this.UserSessionsHistory$.next(history);
        });

        this.GetSessionHistoryForUserPipeline$.pipe(
            switchMap((sessionId) => {
                if (sessionId.trim() != "")
                    return this.service.GetMessagesForUserWithSessionId(sessionId, this.userId).pipe(map(data => ({ data, sessionId })))
                else
                    return of({ data: undefined, sessionId: undefined })
            })
        ).subscribe(({ data, sessionId }) => {
            if (!data) return;
            //Add the chats to the right document
            var history = this.UserSessionsHistory$.value;
            var index = history.findIndex(x => x.sessionId == sessionId);
            if (index != -1) history[index].chats = data;
            console.log(history[index])
            this.UserSessionsHistory$.next(history);
        });

        this.SendMessagePipeline$.pipe(
            switchMap((request) => {
                if (request.sessionId) return this.service.SendUserMsg(request).pipe(map(data => ({ data, request })))
                else return of({ data: undefined, request: undefined })
            })
        ).subscribe(({ data, request }) => {
            if (request && data) {
                //Add the message to the chats
                var history = this.UserSessionsHistory$.value;
                var index = history.findIndex(x => x.sessionId == request.sessionId);
                if(!history[index].chats) history[index].chats = [];
                history[index].chats?.push(data)
                this.UserSessionsHistory$.next(history);
            }
        });
    }

    public SetUserId(id: string): boolean {
        this.userId = id;
        return true;
    }

    public GetUserId(): string {
        return this.userId;
    }

    public ChangeCurrentConversationTo(changeToIndex : number): void {

        console.log(`ChangeCurrentConversationToIndex -> ${changeToIndex}`)

        var history = this.UserSessionsHistory$.value;

        var currentIndex = history.findIndex(x => x.isSelected);

        if(currentIndex == changeToIndex) return;

        if (currentIndex != -1) history[currentIndex].isSelected = false;
        if (changeToIndex != -1) {
            history[changeToIndex].isSelected = true;
            this.UserSessionsHistory$.next(history);
            if (!history[changeToIndex].chats) this.GetSessionHistoryForUserPipeline$.next(history[changeToIndex].sessionId)
        }

    }

    public GetUserSessions(): Observable<Sessions[]> {
        return this.UserSessionsHistory$.asObservable();
    }

    public AddMsgToCurrentSession(message: string) {

        //Find the current conversation
        var history = this.UserSessionsHistory$.value;
        var currentIndex = history.findIndex(x => x.isSelected);

        const messageObj = {
            role: "user",
            content: message
        }

        if(!history[currentIndex].chats) history[currentIndex].chats = [];

        history[currentIndex].chats?.push(messageObj);

        this.UserSessionsHistory$.next(history);

        this.SendMessagePipeline$.next({
            userId: this.userId,
            sessionId: history[currentIndex].sessionId,
            message: message
        });
    }

    public UploadDocument(file: File): void {
        this.UploadDocumentsPipeline$.next(file);
    }

    public GetSummaryForCaseId(caseId: number) {
        this.service.GetCaseSummary(caseId).pipe(first()).subscribe(summary => {
            var history = this.SearchCases$.value;
            history[caseId].summary = summary;
            this.SearchCases$.next(history)
        });
    }

    public GetCaseText(caseId: number) {
        this.service.GetCaseText(caseId).pipe(first()).subscribe(html => {
            var history = this.SearchCases$.value;
            history[caseId].html = html.html;
            this.SearchCases$.next(history);
        })
    }

    public Search(query: string): void {
        this.SearchQueryPipeline$.next(query);
    }

    public CreateNewChatSession(title : string = "New Chat") {
        var history = this.UserSessionsHistory$.value;

        history.push({
            title : title,
            sessionId : "",
            chats : undefined,
            files : undefined,
            isSelected : true,
            questions : undefined
        } as Sessions)

        this.UserSessionsHistory$.next(history);
    }

    public AddCasesToSession(cases : string) : Observable<boolean> {
        return this.service.AddCasesToSession(this.userId,"",cases).pipe(
            first(),
            map((data) => {
                //Add a new chat
                var history = this.UserSessionsHistory$.value;
                //Mark any selected chats as FALSE
                history.forEach(x => x.isSelected = false);
                history.push({
                    title : data.title, //Put the current query for now
                    sessionId : data.sessionId,
                    chats : undefined,
                    files : data.filesInSession,
                    isSelected : true,
                    questions : data.questions
                } as Sessions)
                this.UserSessionsHistory$.next(history);
                return true;
            })
        );
    }

}