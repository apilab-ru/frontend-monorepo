# Концепт фича сервисной архитектуры

## Структура

Базовой единицей приложения является модуль, который является максимально не зависимым
На одном уровне вложенности может быть либо модуль, либо каталог с модулями, смешивания нет.

[Подробнее в структуре](./docs/structure.md)

## Smart/Dump

Все компоненты логически делятся на dump (представление), и smart (медиаторы).

- Dump компоненты не содержат зависимостей от сервисов, не содержат сложной логики
- В идеале у каждого Dump компонента (кроме совсем примитивных) есть story
- Smart компоненты не содержат сложного представления, а орекестрирует dump компонентами
- В идеале, smart компонент не должен содержать стилей вообще, но допускается минимальные стили, например задание отступов между дамп компонентами в себе

Как только компонент начинает содержать сложное представление, при том что содержит и логику, необходимо выделить это представление в отдельный компонент

## Store/Бизнес логика

Хранение данных и бизнес логика содержится в сервисах, сервисы логически разделяются на виды:
* Entity сервисы, могут кешировать в себе состояние связанное с одной сущностью и содержат методы работы с этой сущностью, 
* Фича сервисы - более масштабные, объединяют в себе методы работы над целой фичей, но не могут хранить в себе состояние
* Api сервисы - миддлвар для запросов к апи, и мапинга данных к тем, что ожидает апи

[Подробнее в сервисах](./docs/services.md)

## Пример

[Дока в сторибуке](https://concept.apilab.ru/)

Приложение для разбиения задачи на пункты, и учёта выполненных пунктов. С лоцированием времени на пункт и анализом затраченного времени для прогнозирвоания.

![Схема](https://github.com/apilab-ru/frontend-monorepo/raw/master/apps/concept/project/schema.svg)