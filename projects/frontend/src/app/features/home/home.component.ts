import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ThreeDSphereComponent} from '@shared-library/components';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatChipListbox, MatChipOption} from '@angular/material/chips';
import {CompanyInformation} from '@shared-library/information';

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
