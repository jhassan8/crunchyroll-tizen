window.keyboard = {
  id: "keyboard-screen",
  previous: NaN,
  values: [
    {
      keys: [
        { value: "Q", number: "1", symbol: "1", size: 1 },
        { value: "W", number: "2", symbol: "2", size: 1 },
        { value: "E", number: "3", symbol: "3", size: 1 },
        { value: "R", number: "4", symbol: "4", size: 1 },
        { value: "T", number: "5", symbol: "5", size: 1 },
        { value: "Y", number: "6", symbol: "6", size: 1 },
        { value: "U", number: "7", symbol: "7", size: 1 },
        { value: "I", number: "8", symbol: "8", size: 1 },
        { value: "O", number: "9", symbol: "9", size: 1 },
        { value: "P", number: "0", symbol: "0", size: 1 },
      ],
    },
    {
      keys: [
        { value: "A", number: "@", symbol: "|", size: 1 },
        { value: "S", number: "#", symbol: "/", size: 1 },
        { value: "D", number: "$", symbol: "\\", size: 1 },
        { value: "F", number: "_", symbol: "*", size: 1 },
        { value: "G", number: "&", symbol: "'", size: 1 },
        { value: "H", number: "-", symbol: "\"", size: 1 },
        { value: "J", number: "+", symbol: "=", size: 1 },
        { value: "K", number: "(", symbol: ">", size: 1 },
        { value: "L", number: ")", symbol: "<", size: 1 },
      ],
    },
    {
      keys: [
        { value: "", number: "", symbol: "", size: "alpha" },
        { value: "Z", number: ".", symbol: "~", size: 1 },
        { value: "X", number: "¿", symbol: "[", size: 1 },
        { value: "C", number: "?", symbol: "]", size: 1 },
        { value: "V", number: "¡", symbol: "{", size: 1 },
        { value: "B", number: "!", symbol: "}", size: 1 },
        { value: "N", number: ";", symbol: "%", size: 1 },
        { value: "M", number: ":", symbol: "^", size: 1 },
        { value: "Ñ", number: ",", symbol: "`", size: 1 },
        { value: "", number: "", symbol: "", size: "backspace" },
      ],
    },
    {
      keys: [
        { value: "1 2 3", number: "A B C", symbol: "A B C", size: 2 },
        { value: "", number: "", symbol: "", size: 5 },
        { value: "", number: "", symbol: "", size: "ok" },
      ],
    },
  ],
  selected: [0, 0],
  input: NaN,
  send: NaN,
  alpha: false,
  number: false,

  init: function (element, send) {
    keyboard.selected = [0, 0];
    keyboard.input = element;
    keyboard.send = send;
    keyboard.alpha = false;
    keyboard.number = false;

    var keyboard_element = document.createElement("div");
    keyboard_element.id = keyboard.id;

    keyboard_element.innerHTML = keyboard.generate();
    document.body.appendChild(keyboard_element);

    keyboard.move(keyboard.selected);
    keyboard.previous = main.state;
    main.state = keyboard.id;
    //translate.init();
  },

  destroy: function () {
    document.body.removeChild(document.getElementById(keyboard.id));
    main.state = keyboard.previous;
    keyboard.send = NaN;
  },

  generate: function () {
    var htmlString = "";
    for (var item of keyboard.values) {
      htmlString += `<div class="${keyboard.id}-option row">`;

      for (var key of item.keys) {
        htmlString += `
        <div class="col ${keyboard.getSize(key)}">
          ${keyboard.getValue(key)}
        </div>`;
      }

      htmlString += "</div>";
    }
    return htmlString;
  },

  getValue: function (key) {
    if (keyboard.number) {
      return keyboard.alpha ? key.symbol : key.number;
    } else {
      return key.value[keyboard.alpha ? "toUpperCase" : "toLowerCase"]();
    }
  },

  getSize: function (key) {
    if (key.size === "alpha") {
      return `size-${keyboard.number ? "symbol" : "alpha"}${
        keyboard.alpha ? " active" : ""
      }`;
    } else {
      return `size-${key.size}`;
    }
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case 27:
        keyboard.destroy();
        break;
      case tvKey.KEY_UP:
        if (keyboard.selected[0] > 0) {
          var max = { 1: 8, 3: 2 }[keyboard.selected[0] - 1] || 9;
          keyboard.move([
            keyboard.selected[0] - 1,
            keyboard.selected[0] === 3
              ? 3 * (keyboard.selected[1] + 1) - 1
              : keyboard.selected[1] > max
              ? max
              : keyboard.selected[1],
          ]);
        }
        break;
      case tvKey.KEY_DOWN:
        var max = { 1: 8, 3: 2 }[keyboard.selected[0] + 1] || 9;
        if (keyboard.selected[0] < 3) {
          keyboard.move([
            keyboard.selected[0] + 1,
            keyboard.selected[0] === 2
              ? Math.round(keyboard.selected[1] / 4.5)
              : keyboard.selected[1] > max
              ? max
              : keyboard.selected[1],
          ]);
        }
        break;
      case tvKey.KEY_LEFT:
        var selectedColumn =
          keyboard.selected[1] > 0
            ? keyboard.selected[1] - 1
            : { 1: 8, 3: 2 }[keyboard.selected[0]] || 9;
        keyboard.move([keyboard.selected[0], selectedColumn]);
        break;
      case tvKey.KEY_RIGHT:
        var max = { 1: 8, 3: 2 }[keyboard.selected[0]] || 9;
        keyboard.move([
          keyboard.selected[0],
          keyboard.selected[1] < max ? keyboard.selected[1] + 1 : 0,
        ]);
        break;
      case tvKey.KEY_ENTER:
        keyboard.action(keyboard.selected);
        break;
    }
  },

  move: function (selected) {
    keyboard.selected = selected;
    var options = document.getElementsByClassName(keyboard.id + "-option");
    for (var i = 0; i < options.length; i++) {
      var cols = options[i].children;
      for (var a = 0; a < cols.length; a++) {
        if (i == selected[0] && a == selected[1]) {
          cols[a].className = cols[a].className + " selected";
        } else {
          cols[a].className = cols[a].className.replace(" selected", "");
        }
      }
    }
  },

  action: function (selected) {
    switch (selected[0] + "" + selected[1]) {
      case "20":
        keyboard.upperCase();
        break;
      case "30":
        keyboard.change();
        break;
      case "31":
        keyboard.input.value = keyboard.input.value + " ";
        break;
      case "32":
        keyboard.send && keyboard.send();
        keyboard.destroy();
        break;
      case "29":
        keyboard.input.value = keyboard.input.value.slice(0, -1);
        break;
      default:
        keyboard.input.value =
          keyboard.input.value +
          document.getElementsByClassName(keyboard.id + "-option")[selected[0]]
            .children[selected[1]].innerText;
        break;
    }
  },

  upperCase: function () {
    keyboard.alpha = !keyboard.alpha;
    document.getElementById("keyboard-screen").innerHTML = keyboard.generate();
    keyboard.move(keyboard.selected);
  },

  change: function () {
    keyboard.number = !keyboard.number;
    keyboard.alpha = false;
    document.getElementById("keyboard-screen").innerHTML = keyboard.generate();
    keyboard.move(keyboard.selected);
  },
};
