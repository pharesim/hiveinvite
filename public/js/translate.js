i18next
  .use(i18nextXHRBackend)
  .use(i18nextBrowserLanguageDetector)
  .init({
    fallbackLng: 'en',
    load: 'language-only',
    debug: false,
    backend: {
      loadPath: 'locales/{{lng}}.json'
    }
  });

function translateIndexContent() {
  // languages
  setContentById('languageEN',i18next.t('language.en'));
  setContentById('languageDE',i18next.t('language.de'));
  setContentById('languageAR',i18next.t('language.ar'));
  setContentById('languageEL',i18next.t('language.el'));
  setContentById('languageES',i18next.t('language.es'));
  //setContentById('languageFR',i18next.t('language.fr'));
  setContentById('languageHE',i18next.t('language.he'));
  //setContentById('languageIT',i18next.t('language.it'));
  //setContentById('languageJA',i18next.t('language.ja'));
  //setContentById('languageKO',i18next.t('language.ko'));
  setContentById('languageNL',i18next.t('language.nl'));
  setContentById('languagePL',i18next.t('language.pl'));
  setContentById('languagePT',i18next.t('language.pt'));
  //setContentById('languageRU',i18next.t('language.ru'));
  //setContentById('languageSL',i18next.t('language.sl'));
  setContentById('languageSR',i18next.t('language.sr'));
  setContentById('languageTR',i18next.t('language.tr'));
  //setContentById('languageVI',i18next.t('language.vi'));
  setContentById('languageYO',i18next.t('language.yo'));
  setContentById('languageEO',i18next.t('language.eo'));
  //setContentById('languageZH',i18next.t('language.zh'));

  // loggedout
  setContentById('loggedOutGreeting',i18next.t('loggedout.greeting'));
  setContentById('loggedOutExplainer',i18next.t('loggedout.explainer'));
  setContentById('loginButton',i18next.t('button.login'));
  setContentById('loginButtonText',i18next.t('loggedout.buttontext'));
  setContentById('loginNow',i18next.t('button.login_now'));
  setContentById('loginError',i18next.t('loggedout.login_error'));

  // index
  setContentById('lastupdate',i18next.t('index.lastupdate'));
  setContentById('logoutButton',i18next.t('button.logout'));
  setContentById('languageSwitcher',i18next.t('language.switch'));
  setContentById('refreshLink',i18next.t('index.refresh'));
  setContentById('greeting',i18next.t('index.greeting'));
  setContentById('tokenexplain',i18next.t('index.tokenexplain'));
  setContentById('tokencost',i18next.t('index.tokencost'));
  setContentById('inviteModalButton',i18next.t('index.invitemodal'));
  document.getElementById('loginUsername').placeholder=i18next.t('loggedout.usernamePlaceholder');
}
