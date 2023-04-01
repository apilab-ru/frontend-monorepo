import { Types } from "@filecab/models/types";
import { Injectable } from "@angular/core";
import { PARSER_SCHEMAS, ParserSchema } from "./parser-schemas";
import { SchemaFuncRes } from "./interface";

export interface Schema {
  type: Types;
  func: () => SchemaFuncRes;
}

const MAIL_RU_PRESET: Schema = {
  type: Types.films,
  func: () => {
    const [ru, en] = document.title.split(/[()]/);
    var res = en.split(',');
    const title = (res.length > 1 ? res[0] : ru);
    return { title };
  },
};

const schemas: Record<string, Schema> = {
  'animego.org': {
    type: Types.anime,
    func: () => {
      const rawTitle = document.title;
      const title = rawTitle
        .replace('смотреть онлайн', '')
        .replace('— Аниме', '')
        .trim();
      return { title };
    },
  },
  'anidub.tv': {
    type: Types.anime,
    func: () => {
      const title = document.title.split('/')[1].split('[')[0];
      return { title };
    },
  },
  'animestars.org': {
    type: Types.anime,
    func: () => {
      const [title] = document.title.split('— смотреть');
      return { title };
    },
  },
  'smotret-anime.com': {
    type: Types.anime,
    func: () => {
      const title = (document.querySelector('.line-1') as HTMLElement)?.innerText || document.title;
      return { title };
    },
  },
  'shikimori.one': {
    type: Types.anime,
    func: () => {
      const [title] = document.querySelector('h1').textContent.split('/');
      return { title };
    },
  },
  'dreamerscast.com': {
    type: Types.anime,
    func: () => {
      const [title] = document.title.split('/');
      return { title: title.trim() }
    }
  },
  'kino.mail.ru': MAIL_RU_PRESET,
  'afisha.mail.ru': MAIL_RU_PRESET,
  'ivi.ru': {
    type: Types.films,
    func: () => {
      const [title] = document.title.split(/ \([Ф|С|М]{1}/);
      const type = document.title.includes('Сериал') ? 'tv' : undefined;
      return { type, title };
    },
  },
  'kinopoisk.ru': {
    type: Types.films,
    func: () => {
      const [id, rawType] = location.href.split('/').filter(it => !!it).reverse();
      const title = document.title.split(/[\-\—]/)[0]
        .replace(/([\(\)0-9]{6})/, '')
        .replace(/\([\s\S]*\)/, '')
        .trim();
      const type = (rawType === 'film' ? 'films' : 'tv') as Types;
      return { title, id: +id, idField: 'kinopoisk', type };
    },
  },
  'jut-su.club': {
    type: Types.anime,
    func: () => {
      const title = document.title.split('/')[0].trim();
      return { title }
    }
  },
  default: {
    type: Types.films,
    func: () => ({
      title: document.title,
    }),
  },
};

@Injectable({
  providedIn: "root",
})
export class ParserSchemas {
  private schemas = schemas;

  getImportSchema(domain: string): Schema {
    const schema = this.schemas[domain] || this.schemas.default;

    return schema;
  }

  getParserSchema(domain: string, url: string): undefined | ParserSchema {
    const schema = PARSER_SCHEMAS[domain];

    if (!schema || (schema.check && !schema.check(url))) {
      return undefined;
    }

    return schema;
  }
}
