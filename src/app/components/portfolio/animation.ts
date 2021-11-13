import { animate, state, style, transition, trigger } from '@angular/animations';

export const ANIMATION =
  trigger('cardShow', [
    transition(':enter', [
      style({ height: '0', opacity: '0' }),
      animate(320, style({ height: '*', opacity: '1' })),
    ]),
    transition(':leave', [animate(320, style({ height: '0', opacity: '0', padding: 0 }))]),
  ]);
