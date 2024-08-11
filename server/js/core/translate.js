window.translate = {
  lang: "en",

  init: function () {
    if (session.storage.language && session.storage.language.includes("-")) {
      translate.updateLanguage(session.storage.language);
    } else {
      translate.updateLanguage("en-US");
    }
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
      var text = keys.reduce((obj, i) => obj[i], languages[translate.lang]);
      text = params ? translate.withParams(text, params) : text;
    } catch (error) {
      try {
        var text = keys.reduce((obj, i) => obj[i], languages["en"]);
        text = params ? translate.withParams(text, params) : text;
      } catch (error) {
        console.log('no translate for ' + key)
      }
    }
    return text || key;
  },

  withParams: function (message, params) {
    return Object.keys(params).reduce(
      (param, key) =>
        param.replace(new RegExp(`{\s*${key}\s*}`, "g"), params[key]),
      message
    );
  },

  updateLanguage: function (lang) {
    translate.lang = lang.split("-")[0];
    session.storage.language = lang;
    session.update();
  },
};
