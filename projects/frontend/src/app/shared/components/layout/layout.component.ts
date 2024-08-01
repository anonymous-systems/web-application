import {ChangeDetectionStrategy, Component} from '@angular/core';
import {appRoutes} from '../../../app.routes';
import {RouterOutlet} from '@angular/router';
import {ShellComponent} from '@shared-library/components';
import {GenericItem} from '@shared-library/interfaces';

@Component({
  selector: 'anon-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  standalone: true,
  imports: [ShellComponent, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  readonly appRoutes = appRoutes;

  segments: GenericItem[] = [
    {
      id: 'home',
      name: 'Home',
      icon: 'home',
      routerLink: [appRoutes.home],
    },
    {
      id: 'sign-up',
      name: 'Sign up',
      icon: 'person_add',
      routerLink: [appRoutes.signUp],
    },
    {
      id: 'sign-in',
      name: 'Sign in',
      icon: 'login',
      routerLink: [appRoutes.signIn],
    },
    {
      id: 'welcome',
      name: 'Welcome',
      icon: 'recent_actors',
      routerLink: [appRoutes.welcome],
    },
  ];
}
