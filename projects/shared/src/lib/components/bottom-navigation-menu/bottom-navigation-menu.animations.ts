import {animate, style, transition, trigger} from '@angular/animations';
import {
  emphasizedAccelerate, emphasizedDelecelerate,
} from '../../../assets/scss/partials/_animations';

export const NavigationMenuAnimation = [
  trigger('navigationMenuAnimation', [
    transition(':enter', [
      style({transform: 'translateY(100%)'}),
      /** Emphasized decelerate */
      animate(emphasizedDelecelerate, style({transform: 'translateY(0%)'})),
    ]),
    transition(':leave', [
      style({transform: 'translateY(0%)'}),
      /** Emphasized accelerate */
      animate(emphasizedAccelerate, style({transform: 'translateY(100%)'})),
    ]),
  ]),
];
