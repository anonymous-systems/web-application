import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";

@Injectable({ providedIn: 'root' })
export class SSRSafeService {
  private platformID = inject(PLATFORM_ID);

  get isBrowser() {
    return isPlatformBrowser(this.platformID);
  }

  get isServer() {
    return isPlatformServer(this.platformID);
  }

  get hasWindow() {
    return typeof window !== 'undefined';
  }
}
