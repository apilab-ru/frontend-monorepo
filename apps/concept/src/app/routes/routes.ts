import { Routes } from "@angular/router";

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => import('../board/+tasks/tasks.module').then(m => m.TasksModule),
  }
];