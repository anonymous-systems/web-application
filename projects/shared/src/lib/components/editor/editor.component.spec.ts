import {EditorComponent} from './editor.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorComponent);

    component = fixture.componentInstance;

    component.config.set({});

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
