import { TranslocoConfig, TranslocoTestingModule } from '@ngneat/transloco';
import enUs from '../../assets/i18n/en-us.json';
import zhTw from '../../assets/i18n/zh-tw.json';
import { defaultLanguage, languages } from './transloco-root.module';

export function getTranslocoModule(config: Partial<TranslocoConfig> = {}) {
  return TranslocoTestingModule.withLangs(
    { enUs, zhTw },
    {
      availableLangs: Object.keys(languages),
      defaultLang: defaultLanguage[0],
      fallbackLang: defaultLanguage[0],
      missingHandler: { useFallbackTranslation: true },
      ...config
    }
  );
}
