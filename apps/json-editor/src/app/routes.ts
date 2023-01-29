import { Routes } from "@angular/router";
import { JsonInputComponent } from "./components/json-input/json-input.component";
import { JsonEditorComponent } from "./components/json-editor/json-editor.component";

export const ROOT_ROUTES: Routes = [
  {
    path: 'addFile',
    component: JsonInputComponent,
  },
  {
    path: 'edit',
    component: JsonEditorComponent,
  },
  {
    path: '**',
    redirectTo: 'addFile',
  }
];
