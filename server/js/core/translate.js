window.translate = {
  lang: "en",

  init: function (callback, lang) {
    translate.lang = lang || translate.lang;
    fetch(`server/translate/${translate.lang}.json`)
      .then((response) => response.json())
      .then((json) => {
        translate.add(translate.lang, json);
        callback.success();
      })
      .catch((error) => {
        if (translate.lang !== "en") {
          translate.init(callback, "en");
        } else {
          callback.error(error);
        }
      });
  },

  refresh: function () {
    var elements = document.querySelectorAll("[translate]");
    elements.forEach(
      (element) => (element.innerText = translate.go(element.innerText))
    );
  },

  go: function (key, params) {
    var keys = key.split(".");
    var text = key;
    try {
      var text = keys.reduce((obj, i) => obj[i], translate[translate.lang]);
      text = params ? translate.withParams(text, params) : text;
    } catch (error) {}
    return text || key;
  },

  add: function (lang, dictonary) {
    translate[lang] = translate[lang] || dictonary;
  },

  withParams: function (message, params) {
    return Object.keys(params).reduce(
      (param, key) =>
        param.replace(new RegExp(`{\s*${key}\s*}`, "g"), params[key]),
      message
    );
  },

  getLanguage: function () {
    if (session.storage.language && session.storage.language.includes("-")) {
      translate.updateLanguage(session.storage.language);
    } else {
      translate.updateLanguage("en-US");
    }

    return translate.lang;
  },

  updateLanguage: function (lang) {
    translate.lang = lang.split("-")[0];
    session.storage.language = lang;
    session.update();
  },
};
