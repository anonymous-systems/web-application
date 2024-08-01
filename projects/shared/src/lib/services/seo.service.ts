import {DOCUMENT} from '@angular/common';
import {inject, Injectable} from '@angular/core';
import {Meta, MetaDefinition, Title} from '@angular/platform-browser';
import {CompanyInformation} from '@shared-library/information';
import {SeoMetaTags} from '@shared-library/interfaces';

@Injectable({providedIn: 'root'})
export class SeoService {
  private document = inject(DOCUMENT);

  private titleService = inject(Title);

  private meta = inject(Meta);

  private generateTwitterTags(tags: SeoMetaTags): MetaDefinition[] {
    const title = `${tags.title} - ${CompanyInformation.name}`;

    const description = tags.description || CompanyInformation.byline;

    const image = tags.image || '/assets/imgs/logo.webp';

    return [
      {name: 'twitter:card', content: 'summary'},
      {name: 'twitter:site', content: CompanyInformation.socials.twitter},
      {name: 'twitter:title', content: title},
      {name: 'twitter:description', content: description},
      {name: 'twitter:image', content: image},
    ];
  }

  private generateOpenGraphTags(tags: SeoMetaTags): MetaDefinition[] {
    const title = `${tags.title} - ${CompanyInformation.name}`;

    const description = tags.description || CompanyInformation.byline;

    const image = tags.image || '/assets/imgs/logo.webp';

    const domain = this.document.location.hostname;

    return [
      {name: 'author', content: tags.author || CompanyInformation.name},
      {name: 'description', content: description},
      {property: 'og:type', content: tags.type || 'website'},
      {property: 'og:site_name', content: CompanyInformation.name},
      {property: 'og:title', content: title},
      {property: 'og:description', content: description},
      {property: 'og:image', content: image},
      {property: 'og:url', content: domain + tags.route},
    ];
  }

  generateTags(tags: SeoMetaTags): void {
    const title = `${tags.title} - ${CompanyInformation.name}`;

    this.updateTitle(title);

    const twitterTags = this.generateTwitterTags(tags);

    const openGraphTags = this.generateOpenGraphTags(tags);

    twitterTags.forEach((tag) => this.updateMetaTag(tag));

    openGraphTags.forEach((tag) => this.updateMetaTag(tag));
  }

  updateTitle(title: string) {
    this.titleService.setTitle(title);
  }

  updateMetaTag(
      tag: MetaDefinition, selector?: string,
  ): HTMLMetaElement | null {
    return this.meta.updateTag(tag, selector);
  }
}
