import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";
import { Message } from "primeng/api/message";

@Injectable()
export class UiMessagesService {
  constructor(
    private messageService: MessageService,
  ) {
  }

  success(data: Message): void {
    this.messageService.add({
      severity: 'success',
      ...data,
    })
  }

  error(data: Message): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      ...data,
    })
  }
}