import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatToolbar } from "@angular/material/toolbar";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { GenericItem } from "./shared/interfaces/generic-item";
import { RouterLink } from "@angular/router";
import { NgTemplateOutlet } from "@angular/common";
import {
  CookiesPopupComponent
} from "./shared/components/cookies-popup/cookies-popup.component";
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatToolbar, MatIconButton, MatIcon,
    MatCard, MatCardHeader, MatCardContent,
    MatCardActions, MatButton, MatCardTitle,
    MatCardSubtitle, MatMenu, MatMenuItem,
    RouterLink, MatMenuTrigger, NgTemplateOutlet,
    CookiesPopupComponent, MatDivider,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Angular Template';

  menuItems: GenericItem[] = [
    {
      id: 'angular',
      name: 'Angular',
      href: 'https://angular.dev/',
      icon: 'link',
    },
    {
      id: 'angular-material',
      name: 'Angular Material',
      href: 'https://material.angular.io/',
      icon: 'link',
    },
    {
      id: 'firebase',
      name: 'Firebase',
      href: 'https://firebase.google.com/',
      icon: 'link',
    },
    {
      id: 'material-icons',
      name: 'Material Icons',
      href: 'https://fonts.google.com/icons',
      icon: 'link',
    },
  ];
}
