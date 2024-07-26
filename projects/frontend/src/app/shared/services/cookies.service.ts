import {
  afterNextRender,
  computed,
  inject,
  Injectable,
  signal
} from "@angular/core";
import { SSRSafeService } from "./ssr-safe.service";
import { CookiesConsentValue } from "../types/cookies-consent";

@Injectable({ providedIn: 'root' })
export class CookiesService {
  private ssrSafeService = inject(SSRSafeService);

  private consentForCookiesSignal = signal<CookiesConsentValue>(null);

  hideCookiesConsent = computed<boolean>(() => {
    return this.consentForCookiesSignal() === 'true';
  });

  private localStorageKey = 'accepts_cookies';

  constructor() {
    afterNextRender(() => this.loadConsentCookie());
  }

  acceptCookiesConsent() {
    if (this.ssrSafeService.isServer) return;

    localStorage.setItem(this.localStorageKey, 'true');

    this.consentForCookiesSignal.set('true');
  }

  loadConsentCookie() {
    if (this.ssrSafeService.isServer) return;

    const storedValue =
      localStorage.getItem(this.localStorageKey);

    this.consentForCookiesSignal.set(storedValue === 'true' ? 'true' : null);
  }

  clearCookiesConsent() {
    if (this.ssrSafeService.isServer) return;

    localStorage.removeItem(this.localStorageKey);
  }

  clearAllLocalStorage() {
    if (this.ssrSafeService.isServer) return;

    localStorage.clear();

    this.consentForCookiesSignal.set(null);
  }
}
