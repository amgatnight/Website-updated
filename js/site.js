/**
 * Montreal Hospitality — shared site behaviors
 * -------------------------------------------------
 * Loaded on every page via <script src="/js/site.js" defer></script>
 *
 * What this does:
 *   1. Sets <html lang> from saved language preference BEFORE first paint
 *      so screen readers and search engines see the correct language.
 *   2. Provides a no-op mobile-menu helper for pages that opt in.
 *   3. Hooks into the per-page `translator` object (if present) so its
 *      setLanguage() also persists the html lang attribute.
 */
(function () {
  // --- 1. Initialize html lang from saved preference ---
  try {
    var saved = localStorage.getItem('preferred_language');
    if (saved === 'fr' || saved === 'en') {
      document.documentElement.setAttribute('lang', saved === 'fr' ? 'fr-CA' : 'en');
    }
  } catch (_) {
    // localStorage may be blocked; ignore
  }

  // --- 2. After DOMContentLoaded, patch any page-local translator to
  //        also keep document.documentElement.lang in sync ---
  document.addEventListener('DOMContentLoaded', function () {
    if (typeof window.translator === 'object' && window.translator !== null) {
      var orig = window.translator.setLanguage;
      if (typeof orig === 'function') {
        window.translator.setLanguage = function (lang) {
          orig.call(this, lang);
          document.documentElement.setAttribute(
            'lang',
            lang === 'fr' ? 'fr-CA' : 'en'
          );
        };
      }
      // If translator has currentLang already set (init was synchronous), reflect it
      if (window.translator.currentLang) {
        document.documentElement.setAttribute(
          'lang',
          window.translator.currentLang === 'fr' ? 'fr-CA' : 'en'
        );
      }
    }

    // --- 3. Generic mobile-menu toggle (idempotent) ---
    // Pages can use these IDs and get nav for free; pages that already wire
    // their own handler will keep working since this only fires once.
    var btn = document.getElementById('mobile-menu-btn');
    var menu = document.getElementById('mobile-menu');
    if (btn && menu && !btn.dataset._mhBound) {
      btn.dataset._mhBound = '1';
      btn.addEventListener('click', function () {
        menu.classList.toggle('-translate-x-full');
        document.body.style.overflow = menu.classList.contains('-translate-x-full') ? '' : 'hidden';
      });
    }
  });
})();
