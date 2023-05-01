window.translate = {
  langs: ["en", "es", "pt"],
  lang: "en",

  init: function (lang) {
    translate.langs.forEach((langFile) => {
      fetch(`server/translate/${langFile}.json`)
        .then((response) => response.json())
        .then((json) => {
          translate.add(langFile, json);
          translate.lang = lang || translate.lang;
          var elements = document.querySelectorAll("[translate]");
          elements.forEach(
            (element) => (element.innerText = translate.go(element.innerText))
          );
        });
    });
  },

  go: function (key) {
    return translate[translate.lang]
      ? translate[translate.lang][key] || key
      : key;
  },

  add: function (lang, dictonary) {
    translate[lang] = translate[lang] || dictonary;
  },
};
