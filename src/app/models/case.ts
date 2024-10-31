export interface Case{
    tid : number;
    title : string;
    date : string;
    cites : Citations[];
    numcites : number;
    numcitedby : number;
    doc : string;
}

export interface Citations {
    tid : number;
    title : string;
}