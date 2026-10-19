import { TRANSLOCO_CONFIG } from '@jsverse/transloco';

export const translocoConfig = (langs: string[]) => ({
  provide: TRANSLOCO_CONFIG,
  useValue: {
    availableLangs: langs,
    prodMode: false,
    defaultLang: langs[0],
    reRenderOnLangChange: true,
    missingHandler: {
      logMissingKey: false,
    },
  },
});
