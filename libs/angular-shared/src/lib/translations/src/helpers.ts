/// <reference path="../../../../../../node_modules/@types/webpack-env/index.d.ts" />
import { TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { InjectionToken, Provider } from '@angular/core';
import { IComponentTranslations, RequireContextFn } from './interface';
import { TranslationLoaderService } from './service/translation-loader';

// uglyhack tokens for plain values passing to factory function
export const SCOPE_TOKEN = new InjectionToken('translate.scope');
export const TRANSLATIONS_TOKEN = new InjectionToken('translate.translations');


export function provideTranslationScope(scope: string, translations: IComponentTranslations): Provider[] {
  return [
    { provide: SCOPE_TOKEN, useValue: scope },
    { provide: TRANSLATIONS_TOKEN, useValue: translations },
    {
      provide: TRANSLOCO_SCOPE,
      useFactory: translationFactory,
      deps: [SCOPE_TOKEN, TRANSLATIONS_TOKEN, TranslationLoaderService],
    },
  ];
}

// use `TRANSLOCO_SCOPE` token as component creation hook to register its translation
export function translationFactory(
  scope: string,
  translations: IComponentTranslations,
  translationLoaderService: TranslationLoaderService,
): null {
  translationLoaderService.registerTranslations(scope, translations);

  return null;
}

export function registerTranslationManually(
  scope: string,
  translationsContextFn: RequireContextFn,
  translocoService: TranslocoService,
): void {
  const translations = loadTranslations(translationsContextFn);
  for (const language of Object.keys(translations)) {
    translocoService.setTranslation({ [scope]: translations[language] }, language);
  }
}

export function provideTranslation(scope: string, translationsContextFn: RequireContextFn | undefined): Provider[] {
  if (!translationsContextFn) {
    console.error('not found context fn')
    return [];
  }

  const translations = loadTranslations(translationsContextFn);

  return provideTranslationScope(scope, translations);
}

function loadTranslations(translationsContextFn: RequireContextFn): Record<string, Object> {
  const context = translationsContextFn();
  return context.keys().map(key => {
    const fileNameMatch = key.match(/([a-z0-9-_]+)\.json$/);
    if (!fileNameMatch) {
      throw new Error(`File ${key} doesn't match for translation`);
    }

    return { key, locale: fileNameMatch[1] };
  }).reduce((messages, { key, locale }) => ({
    ...messages,
    [locale]: context(key)
  }), {})
}
