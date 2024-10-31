import { Message } from "./chat";

export interface ContractFile {
    fileName : string;
    uuid : string;
    titleText : string;
}

export interface UploadFileResponse {
    fileId : string;
    questions : Questions[],
    tags : string[],
    fileName : string;
    sessionId : string;
}

export interface Questions {
    questionId : string;
    question : string;
}

export interface ActionButtons {
    label : string;
    questionId : number;
    iconUrl : string;
}

export interface DocumentHistory {
    fileId : string;
    fileName : string;
    sessionId : string;
    chats : Message[];
}

export interface Sessions {
    sessionId : string;
    sessionTitle : string;
}

