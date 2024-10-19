export interface Point {
  text: string;
  description?: string;
}

export interface GroupPoints {
  title: string;
  list: Point[];
}

export interface GoogleApiRow {
  c: (null | {v: string})[];
}

export interface GoogleApiResponse {
  rows: GoogleApiRow[];
}
