import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CompanyInformation} from '../../information';

@Component({
  selector: 'anon-shared-brand-name',
  template: `{{name}}`,
  styles: `:host {font-family: "Nunito", Inter, system-ui;}`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandNameComponent {
  readonly name = CompanyInformation.name;
}
