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
    userId : string;
    fileId : string;
    sessionId : string;
    message : string;
}