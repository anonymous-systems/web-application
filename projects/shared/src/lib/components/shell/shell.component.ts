import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {map} from 'rxjs';
import {
  NavigationDrawerAnimation,
} from '../navigation-drawer/navigation-drawer.animations';
import {
  NavigationMenuAnimation,
} from '../bottom-navigation-menu/bottom-navigation-menu.animations';
import {toSignal} from '@angular/core/rxjs-interop';
import {
  NavigationDrawerComponent,
} from '../navigation-drawer/navigation-drawer.component';
import {BottomNavigationMenuComponent, GenericItem} from '@shared-library';
import {TopAppBarComponent} from '../top-app-bar/top-app-bar.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'anon-shared-shell',
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NavigationDrawerComponent, TopAppBarComponent,
    RouterOutlet, BottomNavigationMenuComponent,
  ],
  animations: [NavigationDrawerAnimation, NavigationMenuAnimation],
})
export class ShellComponent {
  private breakpointObserver = inject(BreakpointObserver);

  segments = input.required<GenericItem[]>();

  homeRoute = input.required<string | string[]>();

  signInRoute = input.required<string | string[]>();

  isMobile = toSignal(
      this.breakpointObserver.observe('(max-width: 599px)').pipe(
          map((state) => state.matches),
      ),
  );

  isTabletPortrait = toSignal(
      this.breakpointObserver.observe('(min-width: 600px)').pipe(
          map((state) => state.matches),
      ),
  );

  private isTabletLandscape = toSignal(
      this.breakpointObserver.observe('(min-width: 905px)').pipe(
          map((state) => state.matches),
      ),
  );

  private isDesktop = toSignal(
      this.breakpointObserver.observe('(min-width: 1440px)').pipe(
          map((state) => state.matches),
      ),
  );

  isDesktopExpanded = toSignal(
      this.breakpointObserver.observe('(min-width: 1648px)').pipe(
          map((state) => state.matches),
      ),
  );
}
