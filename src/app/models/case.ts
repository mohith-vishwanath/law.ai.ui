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

export interface CaseSummary {
    summary : string;
    facts : string;
    reasoning : string;
    arguments : string;
    conclusion : string;
    laws : string;
}