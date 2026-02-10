import { HttpClient } from '@angular/common/http';
import { inject, Injectable, NgModule } from '@angular/core';
import {
  getBrowserCultureLang,
  provideTransloco,
  Translation,
  TranslocoLoader,
  TranslocoModule,
} from '@jsverse/transloco';
import { environment } from '../../../../environments/environment';

export const languages: { [key: string]: string } = {
  'en-us': 'English',
  'zh-tw': '繁體中文',
};

export const defaultLanguage =
  Object.entries(languages).find(
    pair => pair[0] === getBrowserCultureLang().toLowerCase()
  ) ?? Object.entries(languages)[0];

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  getTranslation(lang: string) {
    return this.http.get<Translation>(`./assets/i18n/${lang}.json`);
  }
}

@NgModule({
  exports: [TranslocoModule],
  providers: [
    provideTransloco({
      config: {
        availableLangs: Object.keys(languages),
        defaultLang: defaultLanguage[0],
        fallbackLang: defaultLanguage[0],
        missingHandler: {
          useFallbackTranslation: true,
          logMissingKey: !environment.production,
        },
        reRenderOnLangChange: true,
        prodMode: environment.production,
      },
      loader: TranslocoHttpLoader,
    }),
  ],
})
export class TranslocoRootModule {}
