import { Route, Routes } from "@angular/router";

interface NavItemMeta {
  name: string;
  icon: string;
}

export const MENU: (NavItemMeta & Route)[] = [
  {
    name: 'Аниме',
    icon: 'icon-anime',
    path: 'anime',
    loadChildren: () => import('./pages/+library/library.module').then(m => m.LibraryModule),
    data: {
      type: 'anime'
    },
  },
  {
    name: 'Фильмы',
    icon: 'icon-ticket',
    path: 'films',
    loadChildren: () => import('./pages/+library/library.module').then(m => m.LibraryModule),
    data: {
      type: 'films'
    },
  },
  {
    name: 'Сериалы',
    icon: 'icon-tv',
    path: 'tv',
    loadChildren: () => import('./pages/+library/library.module').then(m => m.LibraryModule),
    data: {
      type: 'tv'
    },
  },
  {
    name: 'Настройки',
    icon: 'icon-config',
    path: 'settings',
    loadChildren: () => import('./pages/+settings/settings.module').then(m => m.SettingsModule),
  }
];

export const ROUTES: Routes = [
  ...MENU,
  {
    path: '**',
    redirectTo: MENU[0].path,
  },
];