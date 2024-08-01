import {
  animate, query, stagger, style, transition, trigger,
} from '@angular/animations';
import {emphasizedDelecelerate} from './emphasized-decelerate.timing';

function generateRandomDelay(min = 0, max = 300): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const FadeInOutAnimation = [
  trigger('fadeInOutStaggerAnimation', [
    transition(':enter', [
      query('@*', [
        style({opacity: 0}),
        stagger(generateRandomDelay(), [
          animate(
              '500ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({opacity: 1}),
          ),
        ]),
      ], {optional: true}),
    ]),
  ]),
  trigger('fadeInOutAnimation', [
    transition(':enter', [
      style({opacity: 0}),
      animate(
          /** Emphasized decelerate */
          emphasizedDelecelerate(2000),
          style({opacity: 1}),
      ),
    ]),
    transition(':leave', [
      style({opacity: 1}),
      animate(
          /** Emphasized accelerate */
          '500ms cubic-bezier(0.3, 0.0, 0.8, 0.15)',
          style({opacity: 0}),
      ),
    ]),
  ],
  ),
  trigger('fadeInAnimation', [
    transition(':enter', [
      style({opacity: 0}),
      animate(
          /** Emphasized decelerate */
          emphasizedDelecelerate(2000),
          style({opacity: 1}),
      ),
    ]),
  ],
  ),
];
