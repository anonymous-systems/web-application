import {
  ChangeDetectionStrategy, ElementRef, viewChild, input, inject,
  Component, effect, model, signal, afterNextRender, afterRender,
} from '@angular/core';
import { DOCUMENT, NgClass } from "@angular/common";
import { LoggerService } from "../../services";

@Component({
  selector: 'anon-shared-three-d-sphere',
  template: `<div #sphereEl id="sphere" [ngClass]="{'rotate': rotate()}"></div>`,
  styleUrl: './three-d-sphere.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass],
})
export class ThreeDSphereComponent {
  private document = inject(DOCUMENT);
  private logger = inject(LoggerService);

  sphereEl = viewChild<ElementRef<HTMLDivElement>>('sphereEl');

  generationTime = signal<number | undefined>(undefined);

  rotate = model(true);

  points = input(500);

  radius = input(160);

  widthPx = input(200);

  heightPx = input(200);

  constructor() {
    const generateSphere = () => effect(
      this.generateSphere,
      { allowSignalWrites: true },
    );

    afterNextRender({ mixedReadWrite: generateSphere });
  }

  generateSphere() {
    const points = this.points();

    const radius = this.radius();

    const rotate = this.rotate();

    const sphereEl = this.sphereEl()?.nativeElement as HTMLDivElement;

    if (!sphereEl) return;

    const start = performance.now();

    /** Temporarily disable rotation */
    if (rotate) this.rotate.set(false);

    sphereEl.style.width = `${this.widthPx()}px`;

    sphereEl.style.height = `${this.heightPx()}px`;

    sphereEl.innerHTML = '';

    for (let i= 1; i <= points; i++) {
      const azimuth = Math.acos(-1 + (2 * i - 1) / points); // Phi

      const elevation = Math.sqrt(points * Math.PI) * azimuth; // Theta

      const x = Math.round(radius * Math.sin(azimuth) * Math.cos(elevation));

      const y = Math.round(radius * Math.sin(azimuth) * Math.sin(elevation));

      const z = Math.round(radius * Math.cos(azimuth));

      const xAngleOfRotation = Math.atan(y / z) * 180 / Math.PI;

      const yAngleOfRotation = Math.atan(x / z) * 180 / Math.PI;

      const zAngleOfRotation = Math.atan(y / x) * 180 / Math.PI;

      const el = this.document.createElement('div');

      el.id = 'point' + i;

      const elStyles = {
        position: 'absolute',
        left: '90px',
        top: '90px',
        width: '10px',
        height: '10px',
        backgroundColor: `hsla(${Math.ceil(360 / points * i)},50%, 50%, .7)`,
        transform: `translateX(${x}px) translateY(${y}px) translateZ(${z}px) rotateX(${xAngleOfRotation}deg) rotateY(${yAngleOfRotation}deg) rotateZ(${zAngleOfRotation}deg)`,
      };

      Object.assign(el.style, elStyles);

      sphereEl.appendChild(el);
    }

    this.generationTime.set(performance.now() - start);

    this.logger.debug(`Generated 3D sphere in ${Number(this.generationTime()).toFixed(2)}ms`);

    if (rotate) this.rotate.set(true);
  }
}
