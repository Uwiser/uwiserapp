import I18n from 'i18n-js';

import en from './en';
import es from './es';
import fr from './fr';
import ja from './ja';
import pt from './pt';

I18n.fallbacks = true;

// const locales = RNLocalize.getLocales();
// if (Array.isArray(locales)) {
//     I18n.locale = locales[0].languageTag;
// }

I18n.translations = {
    en,
    es,
    fr,
    ja,
    pt,
};

export default I18n;