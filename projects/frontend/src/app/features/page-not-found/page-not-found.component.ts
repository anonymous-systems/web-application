import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatAnchor, MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {appRoutes} from '../../app.routes';

@Component({
  standalone: true,
  selector: 'anon-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss',
  imports: [MatButton, RouterLink, MatAnchor],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundComponent {
  protected readonly appRoutes = appRoutes;
}
