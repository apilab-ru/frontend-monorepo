import { NgModule } from "@angular/core";
import { LocalDbStoreService } from "./services/local-db-store.service";
import { MarksApiService } from "./services/marks-api.service";
import { TaskApiService } from "./services/task-api.service";
import { TeamApiService } from "./services/team-api.service";
import { UserApiService } from "./services/user-api.service";

@NgModule({
  providers: [
    LocalDbStoreService,
    MarksApiService,
    TaskApiService,
    TeamApiService,
    UserApiService,
  ]
})
export class ApiModule {
}