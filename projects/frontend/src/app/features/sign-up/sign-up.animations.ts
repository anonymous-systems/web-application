import {
  animate,
  AnimationTriggerMetadata, style,
  transition,
  trigger
} from "@angular/animations";

export const signUpAnimations: AnimationTriggerMetadata[] = [
  trigger(
    'userPhotoAnimation', [
      transition(':enter', [
        style({opacity: 0}),
        /** Emphasized decelerate */
        animate('400ms 100ms cubic-bezier(0.05, 0.7, 0.1, 1.0)', style({opacity: 1})),
      ]),
      transition(':leave',
        /** Emphasized accelerate */
        animate('200ms cubic-bezier(0.3, 0.0, 0.8, 0.15)', style({opacity: 0})),
      ),
    ],
  ),
];
