# WorklogAnalize / Анализатор рабочих логов
[worklog-analyze.apilab.ru](https://worklog-analyze.apilab.ru/)

Сервис для группировки, агрегации и визуализации рабочих логов

## Development server

Run `nx serve worklog-analyze` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Github publish

Use token 
git remote set-url origin https://[USERNAME]:[TOKEN]@git.mycompany.com/[ORGANIZATION]/[REPO].git
git remote set-url origin https://[USERNAME]:[TOKEN]@github.com/apilab-ru/worklog-analize

ng build --prod --base-href "https://apilab-ru.github.io/worklog-analize/
npx angular-cli-ghpages --dir=dist/worklog-analize
