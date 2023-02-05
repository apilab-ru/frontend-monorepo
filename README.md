# Монорепа полезных приложений и утилит

✨ **Использует [Nx](https://nx.dev)** ✨

## Development server

Для запуска использовать `nx serve --project` 

## Приложения
| Проект      | Описание       | Демо                                      | Директория                        |
|-------------|----------------|-------------------------------------------|-----------------------------------|
| json-editor | Редактор JSON  | [json.apilab.ru](https://json.apilab.ru/) | [json-editor](./apps/json-editor) |
| time        | Time recording | [time.apilab.ru](https://time.apilab.ru/) | [time](./apps/time)               |

## Библиотеки
| Проект | Описание                                                  |
|--------|-----------------------------------------------------------|
| store  | Интеграция с indexDB, реализация стора и прочее для стора |

## Understand this workspace

Run `nx graph` to see a diagram of the dependencies of the projects.

## Remote caching

Run `npx nx connect-to-nx-cloud` to enable [remote caching](https://nx.app) and make CI faster.

