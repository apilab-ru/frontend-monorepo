import { Project } from '../components/interfaces/project';

export enum ProjectType {
  frontend = 'Frontend',
  fullStack = 'FullStack',
  websites = 'Suites'
}

export const PROJECTS: Partial<Project>[] = [
  {
    id: 'bsab',
    img: './assets/img/projects/details/bsab/preview.jpg',
    titleShort: 'React/Nest Parser',
    date: '2023-03-06',
    types: [ProjectType.frontend],
    title: 'React/Nest Parser',
    stack: 'React, Nest, typescript, MySql',
    links: [
      {
        href: 'https://bsab.apilab.ru/',
      },
      {
        href: 'https://github.com/apilab-ru/bsab/tree/master/apps/web',
        name: 'GitHub Front',
        icon: 'github'
      }
    ],
  },
  {
    id: 'worklog-analyze',
    img: './assets/img/projects/details/worklog-analyze/preview.jpg',
    titleShort: 'Worklog analyze',
    date: '2022-04-03',
    types: [ProjectType.frontend],
    title: 'Worklog analyze',
    stack: 'Angular 15, chart.js',
    links: [
      {
        href: 'https://worklog-analyze.apilab.ru/',
      },
      {
        href: 'https://github.com/apilab-ru/frontend-monorepo/tree/master/apps/worklog-analize',
        name: 'GitHub Front',
        icon: 'github'
      },
      {
        href: 'https://github.com/apilab-ru/nest-monorepo/tree/master/apps/maps-api',
        name: 'GitHub Api',
        icon: 'github'
      },
      {
        href: 'https://github.com/apilab-ru/nest-monorepo/tree/master/apps/local-api',
        name: 'GitHub Parser',
        icon: 'github'
      }
    ],
  },
  {
    id: 'file-cabinet',
    img: './assets/img/projects/details/file-cabinet/preview.jpg',
    titleShort: 'Chrome extension - Library',
    date: '2021-11-01',
    types: [ProjectType.frontend, ProjectType.fullStack],
    title: 'Chrome extension - Library',
    stack: 'Angular 15, Typescript, NodeJs(NestJS)',
    links: [
      {
        name: 'Store',
        href: 'https://chrome.google.com/webstore/detail/file-cabinet/poiackckjbminlmppejhfkmjkfpfegkd'
      },
      {
        name: 'GitHub Front',
        href: 'https://github.com/apilab-ru/frontend-monorepo/tree/master/apps/filecab',
      },
      {
        name: 'GitHub Backend',
        href: 'https://github.com/apilab-ru/nest-monorepo/tree/master/apps/file-cab',
      },
      {
        name: 'Swagger',
        href: 'http://filecabinet.enotolyb.ru/swagger/#/'
      }
    ],
  },
  {
    id: 'record',
    img: './assets/img/projects/details/record/preview.jpg',
    titleShort: 'Learn Songs Lyric',
    date: '2020-12-01',
    types: [ProjectType.frontend],
    title: 'Chrome extension - Library',
    stack: 'Angular 10, SpeechRecognition',
    links: [
      {
        href: 'https://record.apilab.ru/intro',
      },
      {
        href: 'https://github.com/apilab-ru/audio-record',
        name: 'GitHub',
        icon: 'github'
      }
    ],
  },
  {
    id: 'leads',
    img: './assets/img/projects/details/leads/preview.jpg',
    titleShort: 'Realtime CRM',
    date: '2019-09-01',
    types: [ProjectType.frontend, ProjectType.fullStack],
    title: 'Chrome extension - Library',
    stack: 'Angular 7, Typescript, <s>PHP7.1</s>, NodeJs(NestJS), MySql, Firebase',
    links: [
      {
        href: 'https://leads.apilab.ru/login'
      },
      {
        name: 'Swagger',
        href: 'http://leads-api.enotolyb.ru/swagger/#/'
      },
    ],
  },
  {
    id: 'vue-calc',
    img: './assets/img/projects/preview/calc.jpg',
    date: '2019-03-01',
    types: [ProjectType.frontend],
    stack: 'VueJs, TypeScript, SCSS, Vue CLI',
    links: [
      {
        href: 'http://vue-calc.apilab.ru/',
      }
    ],
  },
  {
    id: 'crm-lang',
    img: './assets/img/projects/preview/crm-lang.jpg',
    date: '2018-06-01',
    types: [ProjectType.frontend, ProjectType.fullStack],
    stack: 'Angular6, TypeScript, SCSS, Angular CLI, Angular Material, PHP7, MySql, Swagger',
    links: [
      {
        name: 'Demo admin@admin.ru / admin',
        href: 'https://crm-lang.apilab.ru/',
      }
    ],
  },
  {
    id: 'time',
    img: './assets/img/projects/details/time/preview.png',
    date: '2018-05-01',
    types: [ProjectType.frontend],
    title: 'Time Tracker',
    stack: 'Angular12, TypeScript, SCSS, Angular CLI, NGRX, Angular Material',
    links: [
      {
        href: 'https://time.apilab.ru/',
      },
      {
        name: 'GitHub',
        icon: 'github',
        href: 'https://github.com/apilab-ru/time-recording',
      }
    ],
  },
  {
    id: 'films',
    img: './assets/img/projects/preview/cinema.jpg',
    date: '2018-07-01',
    types: [ProjectType.frontend],
    stack: 'Angular6, TypeScript, SCSS, Angular CLI, Angular Material',
    links: [
      {
        href: 'https://cinema.apilab.ru/',
      },
      {
        name: 'GitHub',
        href: 'https://github.com/apilab-ru/cinema.pm',
        icon: 'github',
      }
    ],
  },
  {
    id: 'slider',
    img: './assets/img/projects/preview/slider.jpg',
    date: '2017-05-01',
    types: [ProjectType.frontend],
    stack: 'Javascript, JQuery, CSS',
    links: [
      {
        href: 'https://diagram.apilab.ru/',
      }
    ],
  },
  {
    id: 'bouquet-editor',
    img: './assets/img/projects/preview/bouquet-editor.jpg',
    date: '2017-08-01',
    types: [ProjectType.frontend],
    stack: 'Angular1.5, CSS, VK Api',
    links: [
      {
        href: 'https://vk.com/app6097674_-145491189',
      }
    ],
  },
  {
    id: 'crm-stock',
    img: './assets/img/projects/preview/ambar.jpg',
    date: '2017-05-01',
    types: [ProjectType.fullStack],
    stack: 'PHP7, Smarty, MySql, CSS, Bootstrap',
    links: [
      {
        href: 'https://ambar.apilab.ru/',
        name: 'Login/password: admin/admin',
      }
    ]
  },
  {
    id: 'portal',
    img: './assets/img/projects/preview/ssk63.jpg',
    date: '2015-06-01',
    types: [ProjectType.websites],
    stack: 'PHP5, MySql, Smarty, Gimp',
    details: [
      {
        image: '/assets/img/projects/details/ssk63/main.jpg',
      },
    ],
  },
];
