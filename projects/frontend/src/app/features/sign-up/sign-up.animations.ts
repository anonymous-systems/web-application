import {
  animate, AnimationTriggerMetadata, style, transition, trigger,
} from '@angular/animations';
import {
  emphasizedAccelerate, emphasizedDelecelerate,
} from '@shared-library/animations';

export const signUpAnimations: AnimationTriggerMetadata[] = [
  trigger(
      'userPhotoAnimation', [
        transition(':enter', [
          style({opacity: 0}),
          animate(emphasizedDelecelerate(), style({opacity: 1})),
        ]),
        transition(':leave',
            animate(emphasizedAccelerate(), style({opacity: 0})),
        ),
      ],
  ),
];
