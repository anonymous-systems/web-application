import {Title} from '@angular/platform-browser';

export class MockTitleService extends Title {
  override getTitle(): string {
    return '';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override setTitle(newTitle: string): void {
    // Do nothing
  }
}
