import { Route } from "@angular/router";

interface NavItemMeta {
  name: string;
  icon: string;
}

export const MENU: (NavItemMeta & Route)[] = [
  {
    name: 'Аниме',
    icon: 'icon-anime',
    path: 'anime',
    loadChildren: () => import('./pages/+settings/settings.module').then(m => m.SettingsModule),
  },
  {
    name: 'Фильмы',
    icon: 'icon-ticket',
    path: 'films',
    loadChildren: () => import('./pages/+settings/settings.module').then(m => m.SettingsModule),
  },
  {
    name: 'Сериалы',
    icon: 'icon-tv',
    path: 'tv',
    loadChildren: () => import('./pages/+settings/settings.module').then(m => m.SettingsModule),
  },
  {
    name: 'Настройки',
    icon: 'icon-config',
    path: 'settings',
    loadChildren: () => import('./pages/+settings/settings.module').then(m => m.SettingsModule),
  }
];
