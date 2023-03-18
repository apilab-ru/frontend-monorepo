# Lib for dynamic transloco use 
Forked https://github.com/artaommahe/transloco-dynamic-translations

## Use
In component provideTranslation('about', () => import.meta.webpackContext('./translation'))

### In App Module
``
providers: [translocoConfig(['en', 'ru'])]
``

### In Modules 

``
 import: [
  TranslocoModule,
  TranslocoMessageFormatModule.forRoot(),
]
``
