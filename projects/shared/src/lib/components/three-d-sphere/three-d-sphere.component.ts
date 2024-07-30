import {
  ChangeDetectionStrategy, ElementRef, viewChild, input, inject,
  Component, effect, model,
} from '@angular/core';
import {DOCUMENT, NgClass} from '@angular/common';
import {LoggerService} from '../../services';

interface SpherePoint {
  x: number;
  y: number;
  z: number;
  xAngleOfRotation: number;
  yAngleOfRotation: number;
  zAngleOfRotation: number;
  color: string;
}

@Component({
  selector: 'anon-shared-three-d-sphere',
  template: `<div #sphereEl id="sphere" [ngClass]="{'rotate': rotate}"></div>`,
  styleUrl: './three-d-sphere.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass],
})
export class ThreeDSphereComponent {
  private document = inject(DOCUMENT);
  private logger = inject(LoggerService);

  sphereEl = viewChild<ElementRef<HTMLDivElement>>('sphereEl');

  generationTime?: number;

  rotate = true;

  points = model(500);

  radius = input(160);

  width = input(200);

  height = input(200);

  constructor() {
    /** Generate 3D Sphere on changes of following:
     * - points
     * - radius
     * - width
     * - height
     */
    effect(() => {
      /* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
      const points = this.points();

      const radius = this.radius();

      const width = this.width();

      const height = this.height();
      /* eslint-enable @typescript-eslint/no-unused-vars, no-unused-vars */

      this.generateSphere();
    });
  }

  generateSphere() {
    const start = performance.now();

    const sphereElement = this.sphereEl()?.nativeElement;

    if (!sphereElement) return;

    sphereElement.style.width = `${this.width()}px`;

    sphereElement.style.height = `${this.height()}px`;

    sphereElement.innerHTML = '';

    const spherePoints = this.calculateSpherePoints();

    spherePoints.forEach((point, index) => {
      const element = this.createPointElement(point, `point${index + 1}`);

      sphereElement.appendChild(element);
    });

    this.generationTime = performance.now() - start;

    /* eslint-disable-next-line max-len */
    this.logger.debug(`Generated 3D sphere in ${Number(this.generationTime).toFixed(2)}ms`);
  }

  calculateSpherePoints(): SpherePoint[] {
    const points = this.points();

    const radius = this.radius();

    const spherePoints: SpherePoint[] = [];

    for (let i= 1; i <= points; i++) {
      /** Phi */
      const azimuth = Math.acos(-1 + (2 * i - 1) / points);

      /** Theta */
      const elevation = Math.sqrt(points * Math.PI) * azimuth;

      const x = Math.round(radius * Math.sin(azimuth) * Math.cos(elevation));

      const y = Math.round(radius * Math.sin(azimuth) * Math.sin(elevation));

      const z = Math.round(radius * Math.cos(azimuth));

      const xAngleOfRotation = Math.atan(y / z) * 180 / Math.PI;

      const yAngleOfRotation = Math.atan(x / z) * 180 / Math.PI;

      const zAngleOfRotation = Math.atan(y / x) * 180 / Math.PI;

      spherePoints.push({
        x, y, z,
        xAngleOfRotation, yAngleOfRotation, zAngleOfRotation,
        color: `hsla(${Math.ceil(360 / points * i)},50%, 50%, .7)`,
      });
    }

    return spherePoints;
  }

  createPointElement(point: SpherePoint, elementId?: string): HTMLDivElement {
    const element = this.document.createElement('div');

    element.id = elementId || `point${point.x}${point.y}${point.z}`;

    const elementStyles = {
      position: 'absolute',
      left: '90px',
      top: '90px',
      width: '10px',
      height: '10px',
      backgroundColor: point.color,
      /* eslint-disable-next-line max-len */
      transform: `translateX(${point.x}px) translateY(${point.y}px) translateZ(${point.z}px) rotateX(${point.xAngleOfRotation}deg) rotateY(${point.yAngleOfRotation}deg) rotateZ(${point.zAngleOfRotation}deg)`,
    };

    Object.assign(element.style, elementStyles);

    return element;
  }
}
