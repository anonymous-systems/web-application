import {
  ChangeDetectionStrategy, Component, HostBinding, model,
} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'anon-shared-logo',
  template: `
    <img ngSrc="assets/svgs/logo.svg" alt="Logo"
         [width]="width()" [height]="height()"
         [priority]="priority()" />
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
})
export class LogoComponent {
  @HostBinding('attr.aria-hidden') ariaHidden = true;

  width = model(250);

  height = model(250);

  priority = model(false);
}
