import { Injectable } from '@angular/core';
import { MessageService, ToastMessageOptions } from 'primeng/api';

@Injectable()
export class UiMessagesService {
  constructor(private messageService: MessageService) {}

  success(data: ToastMessageOptions): void {
    this.messageService.add({
      severity: 'success',
      ...data,
    });
  }

  error(data: ToastMessageOptions): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      ...data,
    });
  }
}
