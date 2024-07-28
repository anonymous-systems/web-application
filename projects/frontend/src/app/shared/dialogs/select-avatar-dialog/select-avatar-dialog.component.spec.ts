import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAvatarDialogComponent } from './select-avatar-dialog.component';

describe('SelectAvatarComponent', () => {
  let component: SelectAvatarDialogComponent;
  let fixture: ComponentFixture<SelectAvatarDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectAvatarDialogComponent]
    });
    fixture = TestBed.createComponent(SelectAvatarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
