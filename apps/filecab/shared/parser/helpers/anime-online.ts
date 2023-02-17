import { ParserResponse } from '../interface';
import { StatusList } from '@shared/const/const';

const statusCast = {
  'Смотрю': StatusList.process,
  'Просмотрено': StatusList.complete,
  'Отложено': StatusList.planned,
  'Брошено': StatusList.drop,
  'Запланировано': StatusList.planned,
};

export function parserAnimeOnline(): ParserResponse[] {
  const list: ParserResponse[] = [];

  document.querySelectorAll('.m-animelist-card').forEach(card$ => {
    // @ts-ignore
    const statusRaw = card$.querySelector('.card-title')['innerText'];
    // @ts-ignore
    const status = statusCast[statusRaw];

    card$.querySelectorAll('.m-animelist-item').forEach(item$ => {
      // @ts-ignore
      const smotretId = +item$['dataset']['id'];
      const tdList = item$.querySelectorAll('td');

      const name = tdList[1].innerText.split('/')[0].trim();
      const progress = +tdList[2].innerText.split('/')[0].trim();
      const scoreRaw = tdList[3].innerText.trim();
      const star = scoreRaw === '-' ? 0 : +scoreRaw;

      list.push({
        smotretId,
        name,
        type: 'anime',
        meta: {
          progress,
          star,
          status,
        },
      });
    });
  });

  return list;
}
