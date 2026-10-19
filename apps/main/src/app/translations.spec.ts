import { TestBed } from '@angular/core/testing';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { provideTranslocoMessageformat } from '@jsverse/transloco-messageformat';
import { registerTranslationManually } from '../../../../libs/angular-shared/src/lib/translations/src/helpers';

describe('Portfolio translations', () => {
  it('keeps component scopes and ICU pluralization working in English and Russian', () => {
    TestBed.configureTestingModule({
      providers: [
        provideTransloco({ config: { availableLangs: ['en', 'ru'], defaultLang: 'en' } }),
        provideTranslocoMessageformat(),
      ],
    });
    const service = TestBed.inject(TranslocoService);
    registerTranslationManually(
      'header',
      {
        en: { title: 'Portfolio' },
        ru: { title: 'Портфолио' },
      },
      service
    );
    registerTranslationManually(
      'work',
      {
        en: { count: '{count, plural, one {# project} other {# projects}}' },
        ru: { count: '{count, plural, one {# проект} few {# проекта} many {# проектов} other {# проекта}}' },
      },
      service
    );

    expect(service.translate('header.title')).toBe('Portfolio');
    expect(service.translate('work.count', { count: 1 })).toBe('1 project');
    expect(service.translate('work.count', { count: 2 })).toBe('2 projects');
    service.setActiveLang('ru');
    expect(service.translate('header.title')).toBe('Портфолио');
    expect(service.translate('work.count', { count: 2 })).toBe('2 проекта');
    expect(service.translate('work.count', { count: 5 })).toBe('5 проектов');
  });
});
