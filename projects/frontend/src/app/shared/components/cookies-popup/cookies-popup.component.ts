import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from "@angular/core";
import { MatAnchor, MatButton } from "@angular/material/button";
import { CookiesService } from "../../services/cookies.service";

@Component({
  selector: 'app-cookies-popup',
  templateUrl: './cookies-popup.component.html',
  styleUrl: './cookies-popup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatAnchor, MatButton],
})
export class CookiesPopupComponent {
  private cookiesService = inject(CookiesService);

  hideCookiesConsent = this.cookiesService.hideCookiesConsent;

  readonly moreDetailsLink: string = 'https://policies.google.com/technologies/cookies';

  acceptCookies() {
    this.cookiesService.acceptCookiesConsent();
  }
}
