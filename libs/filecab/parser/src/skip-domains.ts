export function checkNeedSkipDomain(url: string): boolean {
  if (!url || url.indexOf('chrome://') === 0) {
    return true;
  }

  if (SKIP_DOMAIN.some(domain => url.includes(domain))) {
    return true;
  }

  return false;
}

const SKIP_DOMAIN = [
  'mail.yandex.ru'
];