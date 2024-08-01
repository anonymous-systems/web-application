import {animate, style, transition, trigger} from '@angular/animations';
import {emphasizedAccelerate} from './emphasized-accelerate.timing';
import {emphasizedDelecelerate} from './emphasized-decelerate.timing';

export const SlideInFromBottomAnimation = [
  trigger('slideInFromBottomAnimation', [
    transition(':enter', [
      style({transform: 'translateY(100%)'}),
      animate(emphasizedDelecelerate(), style({transform: 'translateY(0%)'})),
    ]),
    transition(':leave', [
      style({transform: 'translateY(0%)'}),
      animate(emphasizedAccelerate(), style({transform: 'translateY(100%)'})),
    ]),
  ]),
];
