import { ParserPreset } from '@shared/parser/interface';

export type Tab = chrome.tabs.Tab;

export interface ParserFounded extends ParserPreset {
  founded: boolean;
}
