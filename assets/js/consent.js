/*
 * Cookie-consent configuration for vanilla-cookieconsent v3 (library is loaded in
 * _includes/metadata-hook.html; docs: https://cookieconsent.orestbida.com).
 *
 * Analytics is opt-in. The Google Analytics tag in _includes/analytics/google.html is emitted as
 * type="text/plain" data-category="analytics", so it only runs after the visitor accepts.
 * To gate another third-party script the same way, give it type="text/plain" and
 * data-category="analytics" (or add a new category below).
 */
(function () {
  var root = document.documentElement;
  // Measurement ID, passed in by _includes/metadata-hook.html (read now: currentScript is null later).
  var gaId = document.currentScript && document.currentScript.getAttribute('data-ga-id');

  // Follow the theme's light/dark mode (Chirpy keeps it in data-bs-theme on <html>).
  function syncTheme() {
    root.classList.toggle('cc--darkmode', root.getAttribute('data-bs-theme') === 'dark');
  }
  syncTheme();
  new MutationObserver(syncTheme).observe(root, {
    attributes: true,
    attributeFilter: ['data-bs-theme']
  });

  CookieConsent.run({
    // Withdrawing consent removes the _ga cookies (autoClear below), but the Google tag that was
    // already loaded on THIS page keeps running: left alone, it re-creates its _ga_<id> session
    // cookie when the page unloads (reproduced in headless-browser testing). Google's
    // window['ga-disable-<ID>'] flag switches it off; setting it back to false lets a later
    // re-accept on the same page work without a reload.
    onChange: function (ctx) {
      if (!gaId || ctx.changedCategories.indexOf('analytics') === -1) return;
      window['ga-disable-' + gaId] = !CookieConsent.acceptedCategory('analytics');
    },

    guiOptions: {
      consentModal: {
        layout: 'bar inline', // full-width bar at the top, not a floating card
        position: 'top',
        equalWeightButtons: true, // "Reject" must be as easy to choose as "Accept"
        flipButtons: false
      },
      preferencesModal: {
        layout: 'box',
        equalWeightButtons: true,
        flipButtons: false
      }
    },

    categories: {
      necessary: { enabled: true, readOnly: true },
      analytics: {
        // If a visitor later withdraws consent, remove the cookies Google Analytics already set.
        autoClear: { cookies: [{ name: /^_ga/ }] }
      }
    },

    language: {
      default: 'en',
      translations: {
        en: {
          consentModal: {
            title: 'Cookies',
            description:
              'This site uses Google Analytics for pageview statistics. ' +
              '<a href="/privacy/" class="cc__link">Privacy details</a>',
            acceptAllBtn: 'Accept',
            acceptNecessaryBtn: 'Reject'
          },
          preferencesModal: {
            title: 'Cookie preferences',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
            savePreferencesBtn: 'Save preferences',
            closeIconLabel: 'Close',
            sections: [
              {
                title: 'How this site uses cookies',
                description:
                  'Choose whether to allow analytics. You can change your choice at any time from the ' +
                  '<a href="/privacy/" class="cc__link">Privacy</a> page.'
              },
              {
                title: 'Strictly necessary',
                description: 'Remembers your cookie choice. Always on.',
                linkedCategory: 'necessary',
                cookieTable: {
                  headers: { name: 'Cookie', desc: 'Purpose', exp: 'Expires' },
                  body: [
                    { name: 'cc_cookie', desc: 'Remembers your cookie choice', exp: '6 months' }
                  ]
                }
              },
              {
                title: 'Analytics (Google Analytics)',
                description:
                  'Collects pageview statistics, such as which pages are read and how often. Uses cookies ' +
                  'to recognise repeat visitors. Processed by Google.',
                linkedCategory: 'analytics',
                cookieTable: {
                  headers: { name: 'Cookie', desc: 'Purpose', exp: 'Expires' },
                  body: [
                    { name: '_ga', desc: 'Google Analytics', exp: '2 years' },
                    { name: '_ga_<container-id>', desc: 'Google Analytics', exp: '2 years' }
                  ]
                }
              }
            ]
          }
        }
      }
    }
  });
})();
