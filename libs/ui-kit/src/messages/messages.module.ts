import { NgModule } from "@angular/core";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { UiMessagesService } from "./messages.service";

@NgModule({
  imports: [
    ToastModule,
  ],
  providers: [
    MessageService,
    UiMessagesService,
  ],
  exports: [
    ToastModule,
  ]
})
export class UiMessagesModule {}