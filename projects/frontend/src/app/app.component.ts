import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {
  CookiesPopupComponent,
} from './shared/components/cookies-popup/cookies-popup.component';

@Component({
  standalone: true,
  selector: 'anon-root',
  imports: [RouterOutlet, CookiesPopupComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <router-outlet />

    <anon-cookies-popup />
  `,
})
export class AppComponent {}
