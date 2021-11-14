import { Project } from '../interfaces/project';

export enum ProjectType {
  frontend = 'Frontend',
  fullStack = 'FullStack',
  websites = 'Вебсайты'
}

export const PROJECTS_PREVIEW: Project[] = [
  {
    id: 1,
    img: './assets/img/projects/preview/calc.jpg',
    title: 'Web-component калькулятор на VueJs',
    date: 'Март, 2019',
    types: [ProjectType.frontend],
  },
  {
    id: 2,
    img: './assets/img/projects/preview/crm-lang.jpg',
    title: 'CRM иностранных языков',
    date: 'Июль, 2018',
    types: [ProjectType.frontend, ProjectType.fullStack],
  },
  {
    id: 3,
    img: './assets/img/projects/preview/time.jpg',
    title: 'Приложение учёта времени',
    date: 'Май, 2018',
    types: [ProjectType.frontend],
  },
  {
    id: 4,
    img: './assets/img/projects/preview/cinema.jpg',
    title: 'Список фильмов',
    date: 'Июнь, 2018',
    types: [ProjectType.frontend],
  },
  {
    id: 5,
    img: './assets/img/projects/preview/comepay.jpg',
    title: 'Форма оплаты на angular6',
    date: 'Июнь, 2018',
    types: [ProjectType.frontend],
  },
  {
    id: 6,
    img: './assets/img/projects/preview/slider.jpg',
    title: 'Динамичный слайдер',
    date: 'Май, 2017',
    types: [ProjectType.frontend],
  },
  {
    id: 8,
    img: './assets/img/projects/preview/bouquet-editor.jpg',
    title: 'Редактор Букетов',
    date: 'Август, 2017',
    types: [ProjectType.frontend],
  },
  {
    id: 7,
    img: './assets/img/projects/preview/ambar.jpg',
    title: 'CRM Склад',
    date: 'Май, 2017',
    types: [ProjectType.fullStack],
  },
  {
    id: 9,
    img: './assets/img/projects/preview/ssk63.jpg',
    title: 'Портал компании',
    date: 'Июнь, 2015',
    types: [ProjectType.websites],
  },
];
