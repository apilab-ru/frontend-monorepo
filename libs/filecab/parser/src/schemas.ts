import { Types } from "@filecab/models/types";
import { Injectable } from "@angular/core";
import { PARSER_SCHEMAS, ParserSchema } from "./parser-schemas";
import { SchemaFuncRes } from "./interface";

export interface Schema {
  type: Types;
  func: () => SchemaFuncRes;
}

interface SchemaWithDomain extends Schema {
  domain?: string;
  domains?: string[];
}

const SCHEMAS_ARRAY: SchemaWithDomain[] = [
  {
    domain: 'animego.org',
    type: Types.anime,
    func: () => {
      const rawTitle = document.title;
      const title = rawTitle
        .replace('смотреть онлайн', '')
        .replace('— Аниме', '')
        .trim();
      return { title };
    }
  },
  {
    domain: 'anidub.tv',
    type: Types.anime,
    func: () => {
      const title = document.title.split('/')[1].split('[')[0];
      return { title };
    },
  },
  {
    domain: 'animestars.org',
    type: Types.anime,
    func: () => {
      const [title] = document.title.split('— смотреть');
      return { title };
    },
  },
  {
    domain: 'smotret-anime.com',
    type: Types.anime,
    func: () => {
      const title = (document.querySelector('.line-1') as HTMLElement)?.innerText || document.title;
      return { title };
    },
  },
  {
    domain: 'shikimori.one',
    type: Types.anime,
    func: () => {
      const [title] = document.querySelector('h1').textContent.split('/');
      return { title };
    },
  },
  {
    domain: 'dreamerscast.com',
    type: Types.anime,
    func: () => {
      const [title] = document.title.split('/');
      return { title: title.trim() }
    }
  },
  {
    domains: ['kino.mail.ru', 'afisha.mail.ru'],
    type: Types.films,
    func: () => {
      const [ru, en] = document.title.split(/[()]/);
      var res = en.split(',');
      const title = (res.length > 1 ? res[0] : ru);
      return { title };
    },
  },
  {
    domain: 'ivi.ru',
    type: Types.films,
    func: () => {
      const [title] = document.title.split(/ \([Ф|С|М]{1}/);
      const type = document.title.includes('Сериал') ? 'tv' : undefined;
      return { type, title };
    },
  },
  {
    domains: ['kinopoisk.ru', 'hd.kinopoisk.ru'],
    type: Types.films,
    func: () => {
      const [id, rawType] = location.href.split('/').filter(it => !!it).reverse();
      const title = document.title.split(/[\—]/)[0] // Отбирает название фильма
        .split('(сериал')[0] // Откидывает строку вида: (сериал, все серии, 1 сезон)
        .replace(/([\(\)0-9]{6})/, '')
        .replace(/\([\s\S]*\)/, '')
        .replace(/(,\s\d{4})/, '') //удаляет год
        .trim();
      const type = (rawType === 'film' ? 'films' : 'tv') as Types;
      return { title, id: +id, idField: 'kinopoisk', type };
    },
  },
  {
    domain: 'jut-su.club',
    type: Types.anime,
    func: () => {
      const title = document.title.split('/')[0].trim();
      return { title }
    }
  },
];

const schemas: Record<string, Schema> = {
  default: {
    type: Types.films,
    func: () => ({
      title: document.title,
    }),
  },
};

SCHEMAS_ARRAY.forEach(({ domain, domains, ...schema }) => {
  if (domain) {
    schemas[domain] = schema;
  }

  if (domains) {
    domains.forEach(domain => {
      schemas[domain] = schema;
    })
  }
})

@Injectable({
  providedIn: "root",
})
export class ParserSchemas {
  private schemas = schemas;

  getImportSchema(domain: string): Schema {
    const schema = this.schemas[domain] || this.schemas.default;

    console.log('xxx scema', schema, domain);

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
