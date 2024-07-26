import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { MatToolbarHarness } from "@angular/material/toolbar/testing";
import { MatButtonHarness } from "@angular/material/button/testing";
import {
  MatMenuHarness,
  MatMenuItemHarness
} from "@angular/material/menu/testing";
import { provideNoopAnimations } from "@angular/platform-browser/animations";

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'Angular Template' title`, () => {
    expect(component.title).toEqual('Angular Template');
  });

  it('should render toolbar with title', async () => {
    const toolbar = await loader.getHarness(MatToolbarHarness);
    const toolbarRowsAsText = await toolbar.getRowsAsText();
    const title = toolbarRowsAsText[0];

    expect(title).toBe('Angular Template');
  });

  it('should have a menu button that opens a menu', async () => {
    const menuButton = await loader.getHarness(
      MatButtonHarness.with({ variant: 'icon' }),
    );
    await menuButton.click();

    const menu = await loader.getHarness(MatMenuHarness);
    expect(await menu.isOpen()).toBeTrue();
  });

  xit('should have correct menu items', async () => {
    const menuButton = await loader.getHarness(
      MatButtonHarness.with({ text: '' }),
    );
    await menuButton.click();

    const menuItems = await loader.getAllHarnesses(MatMenuItemHarness);
    expect(menuItems.length).toBe(3);
    expect(await menuItems[0].getText()).toBe('Angular');
    expect(await menuItems[1].getText()).toBe('Angular Material');
    expect(await menuItems[2].getText()).toBe('Firebase');
  });

  it('should render the card elements', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('mat-card')).toBeTruthy();
    expect(
      compiled.querySelector('mat-card-title')?.textContent,
    ).toContain('Welcome to My App!');
    expect(
      compiled.querySelector('mat-card-subtitle')?.textContent,
    ).toContain('Built with Angular, Firebase & Material');
    expect(
      compiled.querySelector('mat-card-content p')?.textContent,
    ).toContain('This is a template for building awesome Angular applications.');
  });

  xit('should have a learn more button that opens a menu', async () => {
    const learnMoreButton = await loader.getHarness(
      MatButtonHarness.with({ text: 'Learn More' }),
    );
    const menu = await loader.getHarness(MatMenuHarness);

    expect(await menu.isOpen()).toBeFalse();

    await learnMoreButton.click();

    expect(await menu.isOpen()).toBeTrue();
  });
});
