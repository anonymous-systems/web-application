import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SignUpComponent} from './sign-up.component';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {MatDialogModule} from '@angular/material/dialog';
import {UserService} from '../../shared/services/user/user.service';
import {of} from 'rxjs';
import {AuthService, LoggerService} from '@shared-library/services';
import {UsernamePipe} from '@shared-library/pipes';

xdescribe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    // spy on and return {} for component.getRouteData
    // spyOn(component, 'getRouteData').and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [SignUpComponent, RouterModule, MatDialogModule],
      providers: [
        {provide: AuthService, useValue: {authState$: () => of(null)}},
        {provide: UserService, useValue: {}},
        {provide: ActivatedRoute, useValue: {data: () => of({})}},
        {provide: LoggerService, useValue: {}},
        {provide: UsernamePipe, useValue: {}},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
