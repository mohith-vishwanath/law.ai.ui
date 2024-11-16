import { Message } from "./chat";

export interface ContractFile {
    fileName : string;
    uuid : string;
    titleText : string;
}

export interface UploadFileResponse {
    questions : string[],
    tags : string[],
    sessionId : string;
    title : string;
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

export interface Sessions {
    title : string;
    sessionId : string;
    chats : Message[] | undefined;
    files : Files[] | undefined;
    isSelected : boolean;
    questions : string[] | undefined;
}

export interface Files {
    type : string; //can be sither "case" or "document"
    name : string;
}