import { SchemaFuncRes } from "./interface";

export interface ParserSchema {
  check?: (url: string) => boolean;
  func: () => SchemaFuncRes;
}

export const PARSER_SCHEMAS: Record<string, ParserSchema> = {
  'mirf.ru': {
    func: () => {
      const title = window.getSelection().toString();
      const type = 'anime';
      return { title, type };
    }
  }
}