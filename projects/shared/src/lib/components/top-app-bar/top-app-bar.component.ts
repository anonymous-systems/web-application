import {ChangeDetectionStrategy, Component, inject, model} from '@angular/core';
import {RouterLink} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {NgOptimizedImage} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {BrandNameComponent} from '@shared-library/components';
import {AuthService} from '@shared-library/services';

@Component({
  selector: 'anon-shared-top-app-bar',
  templateUrl: './top-app-bar.component.html',
  styleUrl: './top-app-bar.component.scss',
  standalone: true,
  imports: [
    RouterLink, BrandNameComponent, MatMenuTrigger, NgOptimizedImage,
    MatIcon, MatMenu, MatButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopAppBarComponent {
  private authService = inject(AuthService);

  readonly title = 'Anonymous Systems';

  homeRoute = model.required<string | string[]>();

  singInRoute = model.required<string | string[]>();

  user = toSignal(this.authService.authState$());

  async signOut() {
    await this.authService.signOut();
  }
}
