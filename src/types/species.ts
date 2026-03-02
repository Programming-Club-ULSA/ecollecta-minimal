export type IUCNStatus =
  | "EX"
  | "EW"
  | "CR"
  | "EN"
  | "VU"
  | "NT"
  | "LC"
  | "DD"
  | "NE";

export interface Taxonomy {
  kingdom: string;
  phylum: string;
  class_: string;        // keep underscore to match backend
  order: string;
  family: string;
  genus: string;
  species: string;
  authority?: string;
  scientificName: string;
}

export interface Species {
  id: string;
  scientificName: string;
  fullScientificName: string;
  commonName: string;
  description: string;
  taxonomy: Taxonomy;
  conservationStatus: IUCNStatus;
  imageUrl: string;
  pdfUrl: string;
}
