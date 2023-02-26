import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  subMenuTemplate$ = new BehaviorSubject<TemplateRef<HTMLElement> | null>(null);

  setSubMenuTemplate(template: TemplateRef<HTMLElement>): void {
    this.subMenuTemplate$.next(template);
  }
}
