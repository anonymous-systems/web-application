import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CompanyInformation, ThreeDSphereComponent } from "@shared-library";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatChipListbox, MatChipOption } from "@angular/material/chips";

@Component({
  selector: 'anon-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ThreeDSphereComponent,
    MatButton, MatIconButton, MatIcon,
    MatChipListbox, MatChipOption,
  ],
})
export class HomeComponent {
  readonly companyName = CompanyInformation.name;
}
