import {animate, style, transition, trigger} from '@angular/animations';

export const NavigationDrawerAnimation = [
  trigger('navigationDrawerAnimation', [
    transition(':enter', [
      style({transform: 'translateX(-100%)'}),
      /** Emphasized decelerate */
      animate(
          'var(--emphasized-decelerate)',
          style({transform: 'translateX(0%)'}),
      ),
    ]),
    transition(':leave', [
      style({transform: 'translateX(0%)'}),
      /** Emphasized accelerate */
      animate(
          'var(--emphasized-accelerate)',
          style({transform: 'translateX(-100%)'}),
      ),
    ]),
  ]),
];
