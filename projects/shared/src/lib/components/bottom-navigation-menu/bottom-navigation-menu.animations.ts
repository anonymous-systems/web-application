import {animate, style, transition, trigger} from '@angular/animations';

export const NavigationMenuAnimation = [
  trigger('navigationMenuAnimation', [
    transition(':enter', [
      style({transform: 'translateY(100%)'}),
      /** Emphasized decelerate */
      animate(
          'var(--emphasized-decelerate)',
          style({transform: 'translateY(0%)'}),
      ),
    ]),
    transition(':leave', [
      style({transform: 'translateY(0%)'}),
      /** Emphasized accelerate */
      animate(
          'var(--emphasized-accelerate)',
          style({transform: 'translateY(100%)'}),
      ),
    ]),
  ]),
];
