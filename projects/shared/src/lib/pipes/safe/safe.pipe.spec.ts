import {SafePipe} from './safe.pipe';
import {DomSanitizer} from '@angular/platform-browser';
import {TestBed} from '@angular/core/testing';

describe('SafePipe', () => {
  let pipe: SafePipe;
  let mockDomSanitizer: jasmine.SpyObj<DomSanitizer>;

  beforeEach(() => {
    mockDomSanitizer = jasmine.createSpyObj(
        'DomSanitizer',
        [
          'bypassSecurityTrustHtml',
          'bypassSecurityTrustStyle',
          'bypassSecurityTrustScript',
          'bypassSecurityTrustUrl',
          'bypassSecurityTrustResourceUrl',
        ],
    );

    TestBed.configureTestingModule({
      providers: [
        {provide: DomSanitizer, useValue: mockDomSanitizer},
      ],
    });
    const sanitizer = TestBed.inject(DomSanitizer);

    pipe = new SafePipe(sanitizer);
  });

  it('should return empty string if content is null', () => {
    expect(pipe.transform(null, 'html')).toBe('');
  });

  it('should return empty string if content is empty', () => {
    expect(pipe.transform('', 'html')).toBe('');
  });

  it('should bypass security for html content', () => {
    mockDomSanitizer.bypassSecurityTrustHtml.and.callThrough();

    const content = '<div>Test</div>';

    pipe.transform(content, 'html');

    expect(mockDomSanitizer.bypassSecurityTrustHtml)
        .toHaveBeenCalledWith(content);
  });

  it('should bypass security for style content', () => {
    mockDomSanitizer.bypassSecurityTrustStyle.and.callThrough();

    const content = 'color: red;';

    pipe.transform(content, 'style');

    expect(mockDomSanitizer.bypassSecurityTrustStyle)
        .toHaveBeenCalledWith(content);
  });

  it('should bypass security for script content', () => {
    mockDomSanitizer.bypassSecurityTrustScript.and.callThrough();

    const content = 'alert("test");';

    pipe.transform(content, 'script');

    expect(mockDomSanitizer.bypassSecurityTrustScript)
        .toHaveBeenCalledWith(content);
  });

  it('should bypass security for url content', () => {
    mockDomSanitizer.bypassSecurityTrustUrl.and.callThrough();

    const content = 'http://example.com';

    pipe.transform(content, 'url');

    expect(mockDomSanitizer.bypassSecurityTrustUrl)
        .toHaveBeenCalledWith(content);
  });

  it('should bypass security for resourceUrl content', () => {
    mockDomSanitizer.bypassSecurityTrustResourceUrl.and.callThrough();

    const content = 'http://example.com/resource';

    pipe.transform(content, 'resourceUrl');

    expect(mockDomSanitizer.bypassSecurityTrustResourceUrl)
        .toHaveBeenCalledWith(content);
  });

  it('should return empty string for unknown type', () => {
    const content = 'unknown';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(pipe.transform(content, 'unknown' as any)).toBe('');
  });
});
