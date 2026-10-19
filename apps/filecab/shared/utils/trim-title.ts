import { captureException } from '@sentry/angular';

const nameExp = /([a-zA-zа-яА-яёЁ\s0-9:,.-]*)/;

export function trimTitle(title: string): string {
  return title.match(nameExp)[0]
    .replace('фильм', '')
    .replace('аниме', '')
    .replace('смотреть онлайн', '')
    .trim();
}
