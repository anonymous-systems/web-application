import {ChangeDetectionStrategy, Component, model} from '@angular/core';
import {GenericItem} from '@shared-library/interfaces';
import {MatButton} from '@angular/material/button';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'anon-shared-navigation-drawer',
  templateUrl: './navigation-drawer.component.html',
  styleUrl: './navigation-drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButton, RouterLinkActive, RouterLink, MatIcon],
})
export class NavigationDrawerComponent {
  segments = model.required<GenericItem[]>();
}
