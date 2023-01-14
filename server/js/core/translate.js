var translate = {
  langs: ["en", "es", "pt"],
  lang: "en",
};

translate.init = function (lang) {
  console.log('traduce...');
  translate.langs.forEach((langFile) => {
    fetch(`server/translate/${langFile}.json`)
      .then((response) => response.json())
      .then((json) => {
        translate.add(langFile, json);
        translate.lang = lang || translate.lang;
        let elements = document.querySelectorAll("[translate]");
        elements.forEach((element) => element.innerText = translate.go(element.innerText));
      })
  });
};

translate.go = function (key) {
  return translate[translate.lang]
    ? translate[translate.lang][key] || key
    : key;
};

translate.add = function (lang, dictonary) {
  translate[lang] = translate[lang] || dictonary;
}; 
