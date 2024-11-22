import { Case } from "./case";

export interface SearchResponse {
  type : string;
  cases : Case[];
  summary : string;
}

export interface SearchMetadata {
  type : string;
  summary : string;
}