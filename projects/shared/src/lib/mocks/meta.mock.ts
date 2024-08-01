import {MetaDefinition} from '@angular/platform-browser';
import {SeoMetaTags} from '@shared-library/interfaces';

export class MockMetaService {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  addTag(tag: MetaDefinition, forceCreation?: boolean): HTMLMetaElement | null {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addTags(tags: MetaDefinition[], forceCreation?: boolean): HTMLMetaElement[] {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTag(attrSelector: string): HTMLMetaElement | null {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTags(attrSelector: string): HTMLMetaElement[] {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateTag(tag: MetaDefinition, selector?: string): HTMLMetaElement | null {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeTag(attrSelector: string): void {
    // Do nothing
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeTagElement(meta: HTMLMetaElement): void {
    // Do nothing
  }
}

export const mockMetaTags: SeoMetaTags = {
  title: 'Mock Title',
  description: 'Mock Description',
  image: 'https://mock-website.com/image.jpg',
  route: '/mock-route',
  author: 'Mock Author',
  type: 'article',
};
