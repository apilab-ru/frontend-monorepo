import { TRANSLOCO_CONFIG } from "@ngneat/transloco";

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
