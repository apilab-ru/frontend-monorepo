import { Provider } from "@angular/core";
import { MessageService } from "primeng/api";
import { UiMessagesService } from "./messages.service";

export function messagesProviders(): Provider[] {
  return [
    MessageService,
    UiMessagesService,
  ]
}