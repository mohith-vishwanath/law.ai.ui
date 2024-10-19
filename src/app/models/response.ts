export interface SearchResponse {
  title: string;
  summary: string;
  numcites: number;
  fileLink: string;
  relevanceScore: number;
  id : number;
  fullText : string;
  date : string;
}
