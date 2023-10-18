import { MetaData } from '@filecab/models/meta-data';

export interface MediaCompareData {
  smotretId?: number;
  shikimoriId?: number;
  imdbId?: number;
}

export interface ParserResponse extends MediaCompareData {
  name: string;
  type?: string;
  meta?: MetaData;
}
