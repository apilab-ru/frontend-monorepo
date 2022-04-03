import { Project } from '../components/interfaces/project';

export enum ProjectType {
  frontend = 'Frontend',
  fullStack = 'FullStack',
  websites = 'Suites'
}

export const PROJECTS: Partial<Project>[] = [
  {
    id: 'worklog-analyze',
    img: './assets/img/projects/details/worklog-analyze/preview.jpg',
    titleShort: 'Worklog analyze',
    date: '2022-04-03',
    types: [ProjectType.frontend],
    title: 'Worklog analyze',
    stack: 'Angular 12, chart.js',
    link: {
      href: 'https://apilab-ru.github.io/worklog-analize/',
      github: 'https://github.com/apilab-ru/worklog-analize',
    },
  },
  {
    id: 'file-cabinet',
    img: './assets/img/projects/details/file-cabinet/preview.jpg',
    titleShort: 'Chrome extension - Library',
    date: '2021-11-01',
    types: [ProjectType.frontend, ProjectType.fullStack],
    title: 'Chrome extension - Library',
    stack: 'Angular 12, Typescript, NodeJs(NestJS)',
    link: {
      name: 'Store',
      href: 'https://chrome.google.com/webstore/detail/file-cabinet/poiackckjbminlmppejhfkmjkfpfegkd'
    },
    link2: {
      name: 'Swagger',
      href: 'http://filecabinet.enotolyb.ru/swagger/#/'
    }
  },
  {
    id: 'record',
    img: './assets/img/projects/details/record/preview.jpg',
    titleShort: 'Learn Songs Lyric',
    date: '2020-12-01',
    types: [ProjectType.frontend],
    title: 'Chrome extension - Library',
    stack: 'Angular 10, SpeechRecognition',
    link: {
      href: 'https://record.apilab.ru/intro',
      github: 'https://github.com/apilab-ru/audio-record',
    },
  },
  {
    id: 'leads',
    img: './assets/img/projects/details/leads/preview.jpg',
    titleShort: 'Realtime CRM',
    date: '2019-09-01',
    types: [ProjectType.frontend, ProjectType.fullStack],
    title: 'Chrome extension - Library',
    stack: 'Angular 7, Typescript, <s>PHP7.1</s>, NodeJs(NestJS), MySql, Firebase',
    link: {
      name: 'Example',
      href: 'https://leads.apilab.ru/login'
    },
    link2: {
      name: 'Swagger',
      href: 'http://leads-api.enotolyb.ru/swagger/#/'
    },
  },
  {
    id: 'vue-calc',
    img: './assets/img/projects/preview/calc.jpg',
    date: '2019-03-01',
    types: [ProjectType.frontend],
    stack: 'VueJs, TypeScript, SCSS, Vue CLI',
    link: {
      href: 'http://vue-calc.apilab.ru/',
    },
  },
  {
    id: 'crm-lang',
    img: './assets/img/projects/preview/crm-lang.jpg',
    date: '2018-06-01',
    types: [ProjectType.frontend, ProjectType.fullStack],
    stack: 'Angular6, TypeScript, SCSS, Angular CLI, Angular Material, PHP7, MySql, Swagger',
    link: {
      name: 'Demo admin@admin.ru / admin',
      href: 'https://crm-lang.apilab.ru/',
    },
  },
  {
    id: 'time',
    img: './assets/img/projects/details/time/preview.png',
    date: '2018-05-01',
    types: [ProjectType.frontend],
    title: 'Time Tracker',
    stack: 'Angular12, TypeScript, SCSS, Angular CLI, NGRX, Angular Material',
    link: {
      href: 'https://time.apilab.ru/',
      github: 'https://github.com/apilab-ru/time-recording',
    },
  },
  {
    id: 'films',
    img: './assets/img/projects/preview/cinema.jpg',
    date: '2018-07-01',
    types: [ProjectType.frontend],
    stack: 'Angular6, TypeScript, SCSS, Angular CLI, Angular Material',
    link: {
      href: 'https://cinema.apilab.ru/',
      github: 'https://github.com/apilab-ru/cinema.pm',
    },
  },
  /*{
    id: 'pay-form',
    img: './assets/img/projects/preview/comepay.jpg',
    date: '2018-06-01',
    types: [ProjectType.frontend],
    stack: 'Angular6, TypeScript, SCSS, Angular CLI',
    link: {
      href: 'http://comepay.apilab.ru/',
    },
  },*/
  {
    id: 'slider',
    img: './assets/img/projects/preview/slider.jpg',
    date: '2017-05-01',
    types: [ProjectType.frontend],
    stack: 'Javascript, JQuery, CSS',
    link: {
      href: 'https://diagram.apilab.ru/',
    },
  },
  {
    id: 'bouquet-editor',
    img: './assets/img/projects/preview/bouquet-editor.jpg',
    date: '2017-08-01',
    types: [ProjectType.frontend],
    stack: 'Angular1, CSS, VK Api',
    link: {
      href: 'https://vk.com/app6097674_-145491189',
    },
  },
  {
    id: 'crm-stock',
    img: './assets/img/projects/preview/ambar.jpg',
    date: '2017-05-01',
    types: [ProjectType.fullStack],
    stack: 'PHP7, Smarty, MySql, CSS, Bootstrap',
    link: {
      href: 'https://ambar.apilab.ru/',
      name: 'Login/password: admin/admin',
    }
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
