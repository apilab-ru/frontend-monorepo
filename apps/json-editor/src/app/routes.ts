import { Routes } from "@angular/router";
import { JsonInputComponent } from "./components/json-input/json-input.component";
import { JsonEditorComponent } from "./components/json-editor/json-editor.component";
import { MenuItem } from "./interface";

export const ROOT_ROUTES: Routes = [
  {
    path: 'addFile',
    component: JsonInputComponent,
    data: {
      name: 'Add File'
    }
  },
  {
    path: 'edit/:id',
    component: JsonEditorComponent,
  },
  {
    path: '**',
    redirectTo: 'addFile',
  }
];

export const MENU: MenuItem[] = ROOT_ROUTES.filter(item => !item.redirectTo && item.data?.name).map(item => ({
  path: item.path,
  name: item.data['name'],
}))
