import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import {
  CookiesPopupComponent
} from "./shared/components/cookies-popup/cookies-popup.component";

@Component({
  standalone: true,
  selector: 'anon-root',
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, CookiesPopupComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
