# FileCabinet

Storybook from https://storybook.js.org/tutorials/intro-to-storybook/angular/en/get-started/

[Extension](https://chrome.google.com/webstore/detail/file-cabinet/poiackckjbminlmppejhfkmjkfpfegkd?hl=ru)

## Процесс разработки

Есть 2 режима разработки, можно разрабатывать в браузере или как обычное веб приложение, для этого:

* Запустить `npm run filecab:ts:browser` - компиляция бекгрануд скрипта
* Открыть папку dist и выполнить `http-server --cors --port=3000` - для расшаривания бекграунд скрипта
* Запустить npm run `npm run filecab:cabinet:browser` / `npm run filecab:popup:browser` - для работы с поапом или кабинетом. 
В режиме разработки бразуер, вебворкер будет запускаться через прокси ангуляра, потому не получится пошарить вебворкер между поапом и
  кабиентом

Дебажить вебворкер можно будет по адресу chrome://inspect/#workers При открытой одной вкладке, обновление страницы будет
подтягивать свежую версию вебворкера

или загружать сразу как расширение хром

* Запустить npm run copy - для копирования мета информации в dist
* Запустить npm run watch:ts
* Запустить npm run watch:cabinet
* Запустить npm run watch:popup
* Открыть браузер и загрузить расширение из папки dist

Дебажить вебворкер можно будет открыв инспектор из расширения, в списке расширений. В таком режиме разработки чтобы
изменения в воркере подтянулись браузером, расширение нужно обновлять кнопкой в списке расширений

Отдельные компоненты можно разрабатывать в сторибуке

* npm run shared:storybook

## Build

npm run build

## After build

Need remove media="print" onload="this.media='all'" or set compiler optimisation options inlineCritical = false, more
detail https://github.com/angular/angular-cli/issues/20864

# Additional

npm install copyfiles -g

## Tools

[Sentry](https://sentry.io/organizations/apilab/issues/?project=6103397)

## SourceMap

--plugin ~build-customization-plugin.js
https://angularquestions.com/2021/05/10/chrome-extension-development-with-angular-how-to-include-source-maps/

