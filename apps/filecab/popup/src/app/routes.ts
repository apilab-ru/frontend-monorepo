import { Routes } from '@angular/router';
import { EditItemComponent } from './components/edit-item/edit-item.component';

export const ROUTES: Routes = [
  {
    path: '',
    component: EditItemComponent,
  }
];

interface MenuItem {
  name: string;
  path: string;
}

export const MENU: MenuItem[] = [
  {
    name: 'Материал',
    path: '#'
  },
  {
    name: 'Библиотека',
    path: '/cabinet/index.html?/'
  },
];
