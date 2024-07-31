import {animate, style, transition, trigger} from '@angular/animations';
import {
  emphasizedAccelerate, emphasizedDelecelerate,
} from '../../../assets/scss/partials/_animations';

export const NavigationDrawerAnimation = [
  trigger('navigationDrawerAnimation', [
    transition(':enter', [
      style({transform: 'translateX(-100%)'}),
      /** Emphasized decelerate */
      animate(emphasizedDelecelerate, style({transform: 'translateX(0%)'})),
    ]),
    transition(':leave', [
      style({transform: 'translateX(0%)'}),
      /** Emphasized accelerate */
      animate(emphasizedAccelerate, style({transform: 'translateX(-100%)'})),
    ]),
  ]),
];
