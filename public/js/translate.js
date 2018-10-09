i18next
  .use(i18nextXHRBackend)
  .use(i18nextBrowserLanguageDetector)
  .init({
    fallbackLng: 'en',
    debug: false,
    backend: {
      loadPath: 'locales/{{lng}}.json'
    }
  });

function translateIndexContent() {
  // languages
  setContentById('languageEN',i18next.t('language.en'));
  setContentById('languageDE',i18next.t('language.de'));

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
  setContentById('abletoclaim',i18next.t('index.abletoclaim'));
  setContentById('freeClaimModalButton',i18next.t('index.claimfreemodal'));
  setContentById('abletobuy',i18next.t('index.abletobuy'));
  setContentById('paidClaimModalButton',i18next.t('index.claimsteemmodal'));
  setContentById('inviteModalButton',i18next.t('index.invitemodal'));

  // free claim modal
  setContentById('freeClaimModalLabel',i18next.t('freeclaimmodal.title'));
  setContentById('freeClaimExplainer',i18next.t('freeclaimmodal.explainer'));
  setContentById('freeClaimMoreExplain',i18next.t('freeclaimmodal.moreexplain'));
  setContentById('freeClaimKey',i18next.t('keys.active_required'));
  setContentById('freeClaimActiveLabel',i18next.t('keys.active'));
  setContentById('storeWIFfreeLabel',i18next.t('keys.storeKey'));
  setContentById('singleFreeClaim',i18next.t('freeclaimmodal.single'));
  setContentById('botFreeClaim',i18next.t('freeclaimmodal.bot'));
  setContentById('freeClaimClose',i18next.t('button.close'));

  //bot claim modal
  setContentById('botClaimModalLabel',i18next.t('botclaimmodal.title'));
  setContentById('botClaimExplainer',i18next.t('botclaimmodal.explainer'));
  setContentById('botClaimStart',i18next.t('botclaimmodal.start'));
  setContentById('botClaimClose',i18next.t('botclaimmodal.close'));

  // paid claim modal
  setContentById('paidClaimModalLabel',i18next.t('paidclaimmodal.title'));
  setContentById('paidClaimExplainer',i18next.t('paidclaimmodal.explainer'));
  setContentById('paidClaimKey',i18next.t('keys.active_required'));
  setContentById('paidClaimActiveLabel',i18next.t('keys.active'));
  setContentById('storeWIFpaidLabel',i18next.t('keys.storeKey'));
  setContentById('paidClaimSubmit',i18next.t('button.submit'));
  setContentById('paidClaimClose',i18next.t('button.close'));
}