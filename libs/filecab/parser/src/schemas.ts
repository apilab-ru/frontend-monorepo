import { Types } from "@filecab/models/types";
import { SearchId } from "@filecab/models";

export interface SchemaFuncRes extends SearchId {
  title: string;
  type?: string | undefined;
}

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
      const [title] = (document.querySelector('.short-t-or') as HTMLElement).innerText.split('/');
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
  default: {
    type: Types.films,
    func: () => ({
      title: document.title,
    }),
  },
};

export class ParserSchemas {
  private schemas = schemas;

  getSchema(domain: string): Schema {
    const schema = this.schemas[domain] || this.schemas.default;

    return schema;
  }
}
