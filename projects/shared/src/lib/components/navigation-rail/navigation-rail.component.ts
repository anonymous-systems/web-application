import {ChangeDetectionStrategy, Component, model} from '@angular/core';
import {GenericItem} from '../../interfaces/generic-item';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'anon-shared-navigation-rail',
  templateUrl: './navigation-rail.component.html',
  styleUrl: './navigation-rail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIcon],
})
export class NavigationRailComponent {
  segments = model.required<GenericItem[]>();
}
