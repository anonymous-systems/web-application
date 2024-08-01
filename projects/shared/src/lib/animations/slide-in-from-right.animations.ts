import {animate, style, transition, trigger} from '@angular/animations';
import {emphasizedDelecelerate} from './emphasized-decelerate.timing';
import {emphasizedAccelerate} from './emphasized-accelerate.timing';

export const SlideInFromRightAnimation = [
  trigger('slideInFromRightAnimation', [
    transition(':enter', [
      style({transform: 'translateX(100%)'}),
      animate(emphasizedDelecelerate(), style({transform: 'translateX(0%)'})),
    ]),
    transition(':leave', [
      style({transform: 'translateX(0%)'}),
      animate(emphasizedAccelerate(), style({transform: 'translateX(100%)'})),
    ]),
  ],
  ),
];
