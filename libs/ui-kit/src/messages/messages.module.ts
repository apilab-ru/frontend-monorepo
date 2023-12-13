import { NgModule } from "@angular/core";
import { ToastModule } from "primeng/toast";
import { messagesProviders } from "./messages-providers";

@NgModule({
  imports: [
    ToastModule,
  ],
  providers: [
    ...messagesProviders()
  ],
  exports: [
    ToastModule,
  ]
})
export class UiMessagesModule {}