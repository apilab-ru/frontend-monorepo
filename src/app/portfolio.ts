import { Project, ProjectDetails } from './components/interfaces/project';

export enum ProjectType {
  frontend = 'Frontend',
  fullStack = 'FullStack',
  websites = 'Вебсайты'
}

export const PROJECTS_PREVIEW: Project[] = [
  {
    id: 'file-cabinet',
    img: './assets/img/projects/details/file-cabinet/preview.jpg',
    title: 'Chrome extension - Library',
    date: 'Ноябрь, 2021',
    types: [ProjectType.frontend],
  },
  {
    id: 'vue-calc',
    img: './assets/img/projects/preview/calc.jpg',
    title: 'Калькулятор на VueJs',
    date: 'Март, 2019',
    types: [ProjectType.frontend],
  },
  {
    id: 'crm-lang',
    img: './assets/img/projects/preview/crm-lang.jpg',
    title: 'CRM иностранных языков',
    date: 'Июль, 2018',
    types: [ProjectType.frontend, ProjectType.fullStack],
  },
  {
    id: 'time',
    img: './assets/img/projects/details/time/preview.png',
    title: 'Приложение учёта времени',
    date: 'Май, 2018',
    types: [ProjectType.frontend],
  },
  {
    id: 'films',
    img: './assets/img/projects/preview/cinema.jpg',
    title: 'Список фильмов',
    date: 'Июнь, 2018',
    types: [ProjectType.frontend],
  },
  {
    id: 'pay-form',
    img: './assets/img/projects/preview/comepay.jpg',
    title: 'Форма оплаты на angular6',
    date: 'Июнь, 2018',
    types: [ProjectType.frontend],
  },
  {
    id: 'slider',
    img: './assets/img/projects/preview/slider.jpg',
    title: 'Динамичный слайдер',
    date: 'Май, 2017',
    types: [ProjectType.frontend],
  },
  {
    id: 'bouquet-editor',
    img: './assets/img/projects/preview/bouquet-editor.jpg',
    title: 'Редактор Букетов',
    date: 'Август, 2017',
    types: [ProjectType.frontend],
  },
  {
    id: 'crm-stock',
    img: './assets/img/projects/preview/ambar.jpg',
    title: 'CRM Склад',
    date: 'Май, 2017',
    types: [ProjectType.fullStack],
  },
  {
    id: 'portal',
    img: './assets/img/projects/preview/ssk63.jpg',
    title: 'Портал компании',
    date: 'Июнь, 2015',
    types: [ProjectType.websites],
  },
];

export const PROJECT_DETAILS: Record<string, ProjectDetails> = {
  ['file-cabinet']: {
    title: 'Chrome extension - Library',
    stack: 'Angular 12, Typescript, NodeJs(NestJS)',
    date: findProject('file-cabinet').date,
    details: [
      {
        text: 'Chrome extension для создания и управления списка фильмов и сериалов для просмотра. ' +
          'Добавление мета данных к фильмам и расширенный поиск. ' +
          'Api NodeJs(NestJS) с интеграцией с smotret-anime.ru и api.themoviedb.org.'
      },
      {
        text: 'Страница внутри расширения, с каталогом и поиском',
        image: '/assets/img/projects/details/file-cabinet/full.jpg',
      },
      {
        text: 'Страница поиска фильма из закладок',
        image: '/assets/img/projects/details/file-cabinet/analyze.jpg',
      },
      {
        text: 'Открытие виджета на сайте с фильмом, для добавления фильма',
        image: '/assets/img/projects/details/file-cabinet/add.jpg',
      },
      {
        text: 'Поап добавления с редактированием мета-данных',
        image: '/assets/img/projects/details/file-cabinet/popup.jpg',
      },
    ],
  },
  ['vue-calc']: {
    title: 'Web Component калькулятор на VueJs',
    stack: 'VueJs, TypeScript, SCSS, Vue CLI',
    date: findProject('vue-calc').date,
    link: {
      href: 'http://vue-calc.apilab.ru/',
    },
    details: [
      {
        text: 'Корзина товаров, с возможностью редактирования свойств позиций, с авто перерасчётом цены. ' +
          'Скомпилировано в WebComponent для интеграции на любой сайт.',
      },
      {
        image: '/assets/img/projects/details/calc/main.png',
      },
      {
        image: '/assets/img/projects/details/calc/main-edit.png',
      },
      {
        image: '/assets/img/projects/details/calc/list.png',
      },
      {
        image: '/assets/img/projects/details/calc/order.png',
      },
    ],
  },
  ['crm-lang']: {
    title: 'CRM языкового центра',
    stack: 'Angular6, TypeScript, SCSS, Angular CLI, Angular Material, PHP7, MySql, Swagger',
    date: findProject('crm-lang').date,
    link: {
      name: 'Демо admin@admin.ru / admin',
      href: 'https://crm-lang.apilab.ru/',
    },
    details: [
      {
        text: 'Фронтенд - angular. Бакенд на сампописном фреймворке на php, ' +
          'с использованием Swagger для документации апи.',
      },
      {
        text: 'Дашборд со статистикой',
        image: '/assets/img/projects/details/crm-lang/dashboard.png',
      },
      {
        text: 'Личный кабинет для ученика, педагога, группы, корпоративного клиента.',
        image: '/assets/img/projects/details/crm-lang/student.png',
      },
      {
        text: 'Добавление, удаление, редактирование всех ролей.',
        image: '/assets/img/projects/details/crm-lang/users.png',
      },
      {
        text: '5 ролей пользователей, с разным доступом и возможностями: Администратор, Менеджер, Корпоративный клиент, Педагог, Ученик.',
        image: '/assets/img/projects/details/crm-lang/auth.png',
      },
      {
        text: 'У педагогов и менеджеров есть возможность вести записи о домашнем задании и оценки выполнения задания для учеников, с комментарием от педагога и сводной статистикой.',
      },
      {
        text: 'Экран учёта посещений.',
        image: '/assets/img/projects/details/crm-lang/attendance.png',
      },
      {
        text: 'Удобные экраны расписания для групп, педагога и ученика.',
        image: '/assets/img/projects/details/crm-lang/schedule.png',
      },
    ],
  },
  ['time']: {
    title: 'Time Tracker',
    stack: 'Angular12, TypeScript, SCSS, Angular CLI, NGRX, Angular Material',
    date: findProject('time').date,
    link: {
      href: 'https://time.apilab.ru/',
      github: 'https://github.com/apilab-ru/time-recording',
    },
    details: [
      {
        text: 'В нашей профессии важно оценивать время, затраченное на задачу, ' +
          'и замерять фактически потраченное время, чтобы делать прогнозы точнее. ' +
          'К тому же, я должен предоставить отчет, сколько времени какая задача у меня заняла.',
      },
      {
        text: 'Для этого я создал себе такой удобный инструмент для ведения учёта времени.\n' +
          'Я делал его максимально простым и удобным (и в короткие сроки).\n' +
          'При каждом действии пользователя данные сохраняются в localStorage браузера (чтобы случайно закрыв вкладку не потерять данные).',
      },
      {
        image: '/assets/img/projects/details/time/time-main.jpg',
      },
    ],
  },
  ['films']: {
    title: 'Список фильмов',
    stack: 'Angular6, TypeScript, SCSS, Angular CLI, Angular Material',
    date: findProject('films').date,
    link: {
      href: 'https://cinema.apilab.ru/',
      github: 'https://github.com/apilab-ru/cinema.pm',
    },
    details: [
      {
        text: 'Маленький проект, сделанный за 3 часа, для ведения списка просмотренных фильмов. ' +
          'С адаптацией под мобильные устройства.',
      },
      {
        image: '/assets/img/projects/details/cinema/cinema.png',
      },
      {
        image: '/assets/img/projects/details/cinema/mobile.png',
      },
    ],
  },
  ['pay-form']: {
    title: 'Форма оплаты с валидацией и адаптацией под мобильный, на angular6.',
    stack: 'Angular6, TypeScript, SCSS, Angular CLI',
    date: findProject('pay-form').date,
    link: {
      href: 'http://comepay.apilab.ru/',
    },
    details: [
      {
        text: 'Форма оплаты с валидацией и адаптацией под мобильный, на angular6.',
      },
      {
        image: '/assets/img/projects/details/comepay/main.png',
      },
      {
        image: '/assets/img/projects/details/comepay/mobile.png',
      },

    ],
  },
  ['slider']: {
    title: 'Динамичный Слайдер',
    stack: 'Javascrip, D3, JQary, CSS',
    date: findProject('slider').date,
    link: {
      href: 'https://diagram.apilab.ru/',
    },
    details: [
      {
        text: 'Круговой многоуровневый слайдер с поддержкой неограниченного количества уровней и очень большого ' +
          'кол-ва элементов (тестировалось на 500 000 элементах), с подгрузкой элементов по мере необходимости.',
      },
      {
        image: '/assets/img/projects/details/diagram/diagram.jpg',
      },
      {
        image: '/assets/img/projects/details/diagram/diagram.gif',
      },
    ],
  },
  ['bouquet-editor']: {
    title: 'Приложения для Вконтакте, Редактор Букетов',
    stack: 'Angular1, CSS, VK Api',
    date: findProject('bouquet-editor').date,
    link: {
      href: 'https://vk.com/app6097674_-145491189',
    },
    details: [
      {
        text: 'Прототип приложения редактора букетов, позволяющее выбрать несколько цветов, сгруппировать их в букет, ' +
          'прикрепить к ним стикеры, и написать записку к букету. По мере оформлении букета автоматически ' +
          'подсчитывается стоимость, после оформления, фотография полученного букета отправляется администратору.',
      },
      {
        image: '/assets/img/projects/details/bouquet/main.png',
      },
      {
        image: '/assets/img/projects/details/bouquet/stock.jpg',
      },
    ],
  },
  ['crm-stock']: {
    title: 'CRM Склад',
    stack: 'PHP7, Smarty, MySql, CSS, Bootstrap',
    date: findProject('crm-stock').date,
    link: {
      href: 'https://ambar.apilab.ru/',
      name: 'Ссылка admin/admin',
    },
    details: [
      {
        text: 'Crm для учёта продаж и ведения баланса товаров магазина.',
      },
      {
        image: '/assets/img/projects/details/ambar/ambar.png',
      },
      {
        image: '/assets/img/projects/details/ambar/menu.png',
      },
      {
        image: '/assets/img/projects/details/ambar/filter.png',
      },
    ],
  },
  ['portal']: {
    title: 'Портал компании',
    stack: 'PHP5, MySql, Smarty, Gimp',
    date: findProject('portal').date,
    details: [
      {
        image: '/assets/img/projects/details/ssk63/main.jpg',
      },
    ],
  },
};

function findProject(id: string): Project {
  return PROJECTS_PREVIEW.find(item => item.id === id)!;
}
