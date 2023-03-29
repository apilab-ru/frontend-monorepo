import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BoardComponent } from "./components/board/board.component";

const routes: Routes = [
  {
    path: '',
    component: BoardComponent,
  }
];

@NgModule({
  declarations: [
    BoardComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
  ],
})
export class TasksModule {
}