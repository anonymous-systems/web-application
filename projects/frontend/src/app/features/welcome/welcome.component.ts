import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {appRoutes} from '../../app.routes';
import {CompanyInformation} from '@shared-library/information';
import {LogoComponent} from '@shared-library/components';

@Component({
  standalone: true,
  selector: 'anon-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, MatButtonModule, RouterLink, LogoComponent],
})
export class WelcomeComponent {
  protected readonly appRoutes = appRoutes;

  readonly title = `Welcome to ${CompanyInformation.name}`;

  readonly description = CompanyInformation.byline;
}
