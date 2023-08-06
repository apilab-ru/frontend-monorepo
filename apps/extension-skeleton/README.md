# Шаблон браузерного расширения на Angular 15

Проект шаблон расширения для браузера (заточенный в первую очередь под GoogleChrome). 
Стек Angular 15 + typescript + упрощённый redux + share

## Структура
Шаблон состоит из проектов:
* background - скрипт запускаемый в фоне в воркере, содержит
** стор, 
** апи для обращений к серверу,
** reducers - редюсеры для изменния стора 
** плюс седержит сервис обёртку для взаимодействия с воркером из ангуляр приложения
* cabinet - приложения запускаемое при переходе внутрь расширения, можно открыть из поапа переходом на ссылку /cabinet/index.html?/
* extension - мета данные приложения
* popup - приложения открывающиеся в поапе, при клике на иконку расширения
* shared - переиспользуемые элементы

## Процесс разработки
Есть 2 режима разработки, можно разрабатывать в браузере или как обычное веб приложение, для этого:
* Запустить npm run start:ts - компиляция бекгрануд скрипта
* Открыть папку dist и выполнить npx serve - для расшаривания бекграунд скрипта
* Запустить npm run start:cabinet / npm run start:popup - для работы с поапом или кабинетом. В режиме разработки бразуер, 
вебворкер будет запускаться через прокси ангуляра, потому не получится пошарить вебворкер между поапом и кабиентом

Дебажить вебворкер можно будет по адресу chrome://inspect/#workers
При открытой одной вкладке, обновление страницы будет подтягивать свежую версию вебворкера

или загружать сразу как расширение хром
* Запустить npm run copy - для копирования мета информации в dist
* Запустить npm run watch:ts
* Запустить npm run watch:cabinet
* Запустить npm run watch:popup
* Открыть браузер и загрузить расширение из папки dist

Дебажить вебворкер можно будет открыв инспектор из расширения, в списке расширений.
В таком режиме разработки чтобы изменения в воркере подтянулись браузером, расширение нужно обновлять кнопкой в списке расширений

Отдельные компоненты можно разрабатывать в сторибуке
* npm run shared:storybook

## Версия вне монорепозитория
https://github.com/apilab-ru/extension-skeleton

## Команды
```
"copy": "copyfiles -f ./apps/extension-skeleton/extension/* ./apps/extension-skeleton/dist",

"cabinet:dev": "nx run extension-skeleton-cabinet:build:development --watch",
"popup:dev": "nx run extension-skeleton-popup:build:development --watch",
"ts:dev": "webpack --mode development --config ./apps/extension-skeleton/background/webpack.config.js --env=development -w",

"cabinet:browser": "nx run extension-skeleton-cabinet:serve:browser",
"popup:browser": "nx run extension-skeleton-popup:serve:browser",
"ts:browser": "webpack --mode development --config ./apps/extension-skeleton/background/webpack.config.js --env=browser -w",

"cabinet:build": "nx run extension-skeleton-cabinet:build:production",
"popup:build": "nx run extension-skeleton-popup:build:production",
"ts:build": "webpack --config ./apps/extension-skeleton/background/webpack.config.js --env=production --devtool=false",
```