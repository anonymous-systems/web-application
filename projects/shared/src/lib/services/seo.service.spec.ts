import {TestBed} from '@angular/core/testing';

import {SeoService} from './seo.service';
import {Meta, Title} from '@angular/platform-browser';
import {DOCUMENT} from '@angular/common';

describe('SeoService', () => {
  let service: SeoService;
  let mockTitleService: jasmine.SpyObj<Title>;
  let mockMetaService: jasmine.SpyObj<Meta>;


  beforeEach(() => {
    mockTitleService = jasmine.createSpyObj('Title', ['getTitle', 'setTitle']);

    mockMetaService = jasmine.createSpyObj('Meta', ['updateTag']);

    TestBed.configureTestingModule({
      providers: [
        SeoService,
        {provide: Title, useValue: mockTitleService},
        {provide: Meta, useValue: mockMetaService},
        {provide: DOCUMENT, useValue: {}},
      ],
    });

    service = TestBed.inject(SeoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
