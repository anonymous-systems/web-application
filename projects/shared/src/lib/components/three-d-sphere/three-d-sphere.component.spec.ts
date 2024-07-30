import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ThreeDSphereComponent} from './three-d-sphere.component';

describe('ThreeDSphereComponent', () => {
  let component: ThreeDSphereComponent;
  let fixture: ComponentFixture<ThreeDSphereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreeDSphereComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ThreeDSphereComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate a 3D sphere', () => {
    component.points.set(10);

    fixture.detectChanges();

    expect(component.sphereEl()?.nativeElement).toBeTruthy();

    expect(component.sphereEl()?.nativeElement.innerHTML).toContain('point1');
  });
});
