import {ChangeDetectionStrategy, Component, model} from '@angular/core';
import {GenericItem} from '@shared-library/interfaces';
import {MatFabButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIcon} from '@angular/material/icon';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'anon-shared-bottom-navigation-menu',
  templateUrl: './bottom-navigation-menu.component.html',
  styleUrl: './bottom-navigation-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFabButton, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem,
    RouterLinkActive, RouterLink,
  ],
})
export class BottomNavigationMenuComponent {
  segments = model.required<GenericItem[]>({});
}
