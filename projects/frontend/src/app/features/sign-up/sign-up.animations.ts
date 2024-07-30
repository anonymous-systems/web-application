import {
  animate,
  AnimationTriggerMetadata, style,
  transition,
  trigger,
} from '@angular/animations';

export const signUpAnimations: AnimationTriggerMetadata[] = [
  trigger(
      'userPhotoAnimation', [
        transition(':enter', [
          style({opacity: 0}),
          /** Emphasized decelerate */
          animate('var(--emphasized-decelerate)', style({opacity: 1})),
        ]),
        transition(':leave',
        /** Emphasized accelerate */
            animate('var(--emphasized-accelerate)', style({opacity: 0})),
        ),
      ],
  ),
];
