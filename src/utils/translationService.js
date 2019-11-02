import i18n from 'i18next';

import pt from '../constants/translations/pt';
import en from '../constants/translations/en';

class TranslationService {
  constructor() {
    this.__loaded = false;
  }

  async init() {
    await i18n.init({
      lng: 'pt',
      fallbackLng: 'en',
      resources: {
        pt,
        en,
      },
      defaultNS: 'default',
    });
    this.__loaded = true;
  }

  get(key) {
    if (!this.__loaded) {
      return '';
    }
    return i18n.t(key);
  }
}

export default new TranslationService();
