import { animate, style, transition, trigger } from '@angular/animations';

export const TOGGLE_ANIMATION = trigger('toggle', [
  transition(':leave', [animate('300ms', style({ opacity: 0, height: 0, padding: 0 }))]),
]);
