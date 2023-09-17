import { environment } from '@environments';

import { BackgroundBaseService } from "../../background/src/background-base.service";
import { filter, fromEvent, map, NEVER, switchMap } from "rxjs";
import { ParserTokens } from "./parser-tokens";
import { NotificationsService } from "./notifications";

const backgroundService = new BackgroundBaseService(environment);
const parserTokens = new ParserTokens();
const notificationService = new NotificationsService();

backgroundService.select('config').pipe(
  switchMap( config => (config?.enabled && config?.rules) ? fromEvent(document, 'click').pipe(
    // @ts-ignore
    filter(event => event?.target?.innerText),
    map(event => ({
      rules: config.rules,
      // @ts-ignore
      text: event?.target?.innerText
    }))
  ) : NEVER),
  map(data => parserTokens.parse(data.rules, data.text)),
  filter(Boolean),
).subscribe(text => {
  navigator.clipboard.writeText(text);
  notificationService.message(`Token copied: ${text}`);
});

