export interface ContractFile {
    fileName : string;
    uuid : string;
    titleText : string;
}

export interface UploadFileResponse {
    uuid : string;
    questions : Questions[],
    tags : string[],
    fileName : string;
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