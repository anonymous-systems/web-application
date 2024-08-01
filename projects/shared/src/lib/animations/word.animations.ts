import {
  style, transition, trigger, animate, AnimationTriggerMetadata,
} from '@angular/animations';
import {emphasizedAccelerate} from './emphasized-accelerate.timing';

export const WordAnimation: AnimationTriggerMetadata[] = [
  trigger('wordAnimation', [
    transition(':enter', [
      style({opacity: 0, transform: 'translateY(-50%)'}),
      animate(
          emphasizedAccelerate('800ms 200ms'),
          style({opacity: 1, transform: 'translateY(0)'}),
      ),
    ]),
    transition(':leave', [
      style({opacity: 1, transform: 'translateY(0)'}),
      animate(
          emphasizedAccelerate(),
          style({opacity: 0, transform: 'translateY(-50%)'}),
      ),
    ]),
  ]),
];
