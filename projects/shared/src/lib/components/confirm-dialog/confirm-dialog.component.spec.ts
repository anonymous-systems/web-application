import {ComponentFixture, TestBed} from '@angular/core/testing';

import {
  ConfirmDialogComponent,
  ConfirmDialogContract,
} from './confirm-dialog.component';
import {
  MAT_DIALOG_DATA, MatDialogRef,
} from '@angular/material/dialog';
import {MatButtonHarness} from '@angular/material/button/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let loader: HarnessLoader;
  let mockMatDialogRef: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

  const mockConfirmDialogContract: ConfirmDialogContract = {
    description: 'Mock test description',
  };

  beforeEach(async () => {
    mockMatDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: mockConfirmDialogContract},
        {provide: MatDialogRef, useValue: mockMatDialogRef},
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);

    loader = TestbedHarnessEnvironment.loader(fixture);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize description from data', () => {
    expect(component.description())
        .toEqual(mockConfirmDialogContract.description);
  });

  it('should initialize buttonText from data', () => {
    expect(component.buttonText()).toBe('Confirm');
  });

  it('should close dialog on cancel button click', async () => {
    const cancelButton = await loader.getHarness(
        MatButtonHarness.with({text: 'Cancel'}),
    );

    await cancelButton.click();

    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });

  it('should close dialog with true on confirm button click', async () => {
    const confirmButton = await loader.getHarness(
        MatButtonHarness.with({text: component.buttonText()}),
    );

    await confirmButton.click();

    expect(mockMatDialogRef.close).toHaveBeenCalledWith(true);
  });
});
