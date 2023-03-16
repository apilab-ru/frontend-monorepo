import { Routes } from '@angular/router';
import { EditItemComponent } from './components/edit-item/edit-item.component';
import { EditContext } from "./services/edit-context";
import { PageContext } from "./services/page-context";
import { ParserContext } from "./services/parser-context";

export const ROUTES: Routes = [
  {
    path: '',
    component: EditItemComponent,
    providers: [
      { provide: EditContext, useClass: PageContext }
    ]
  },
  {
    path: 'search',
    component: EditItemComponent,
    providers: [
      { provide: EditContext, useClass: ParserContext }
    ]
  }
];

interface MenuItem {
  name: string;
  path: string;
}

export const MENU: MenuItem[] = [
  {
    name: 'Страница',
    path: '#'
  },
  {
    name: 'Поиск',
    path: 'search'
  },
  {
    name: 'Библиотека',
    path: '/cabinet/index.html?/'
  },
];
