export interface Case{
    id : number;
    title : string;
    date : string;
    numcites : number;
    numcitedby : number;
    html : string;
    summary : CaseSummary;
    source : string;
    score : number;
    isChecked : boolean;
}

export interface CaseSummary {
    Summary : string;
    Facts : string;
    Reasoning : string;
    Arguments : any;
    Conclusion : string;
    Laws : string;
}