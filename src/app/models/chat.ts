import { Files } from "./contractFile";

export interface ChatMessages {
    sessionId : string;
    fileName : string;
    messages : Message[]
}

export interface Message {
    role : string;
    content : string;
}

export interface NewMsgRequest {
    sessionId : string;
    message : string;
}

export interface AddFileOrCaseToSessionResponse {
    sessionId : string;
    title : string;
    questions : string[];
    filesInSession : Files[]
    type : string; //is it a case chat or a document chat
}