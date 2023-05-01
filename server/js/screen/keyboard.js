window.keyboard = {
  id: "keyboard-screen",
  previous: NaN,
  selected: [0, 0],
  input: NaN,
  send: NaN,

  init: function (element, send) {
    this.input = element;
    this.send = send;
    var values = [
      {
        keys: [
          { value: "Q", number: "1", size: 1 },
          { value: "W", number: "2", size: 1 },
          { value: "E", number: "3", size: 1 },
          { value: "R", number: "4", size: 1 },
          { value: "T", number: "5", size: 1 },
          { value: "Y", number: "6", size: 1 },
          { value: "U", number: "7", size: 1 },
          { value: "I", number: "8", size: 1 },
          { value: "O", number: "9", size: 1 },
          { value: "P", number: "0", size: 1 },
        ],
      },
      {
        keys: [
          { value: "A", number: "@", size: 1 },
          { value: "S", number: "#", size: 1 },
          { value: "D", number: "$", size: 1 },
          { value: "F", number: "_", size: 1 },
          { value: "G", number: "&", size: 1 },
          { value: "H", number: "-", size: 1 },
          { value: "J", number: "+", size: 1 },
          { value: "K", number: "(", size: 1 },
          { value: "L", number: ")", size: 1 },
        ],
      },
      {
        keys: [
          { value: "", number: "", size: "alpha" },
          { value: "Z", number: ".", size: 1 },
          { value: "X", number: "¿", size: 1 },
          { value: "C", number: "?", size: 1 },
          { value: "V", number: "¡", size: 1 },
          { value: "B", number: "!", size: 1 },
          { value: "N", number: ";", size: 1 },
          { value: "M", number: ":", size: 1 },
          { value: "Ñ", number: ",", size: 1 },
          { value: "", number: "", size: "backspace" },
        ],
      },
      {
        keys: [
          { value: "1 2 3", number: "A B C", size: 2 },
          { value: "", number: "", size: 5 },
          { value: "", number: "", size: "ok" },
        ],
      },
    ];

    var keyboard_element = document.createElement("div");
    keyboard_element.id = this.id;

    var htmlString = "";

    for (var item of values) {
      htmlString += `
      <div class="${this.id}-option row">
      `;

      for (var key of item.keys) {
        htmlString += `
        <div class="col size-${key.size}" alter="${key.number}">
          ${key.value.toLocaleLowerCase()}
        </div>`;
      }

      htmlString += `
      </div>`;
    }

    keyboard_element.innerHTML = htmlString;
    document.body.appendChild(keyboard_element);

    this.move(this.selected);
    this.previous = main.state;
    main.state = this.id;
    //translate.init();
  },

  destroy: function () {
    document.body.removeChild(document.getElementById(this.id));
    main.state = this.previous;
    this.send = NaN;
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case 27:
        this.destroy();
        break;
      case tvKey.KEY_UP:
        if (this.selected[0] > 0) {
          var max = [0, 2].includes(this.selected[0] - 1) ? 9 : 8;
          this.move([
            this.selected[0] - 1,
            this.selected[0] === 3
              ? 3 * (this.selected[1] + 1) - 1
              : this.selected[1] > max
              ? max
              : this.selected[1],
          ]);
        }
        break;
      case tvKey.KEY_DOWN:
        var max =
          this.selected[0] + 1 == 1 ? 8 : this.selected[0] + 1 == 3 ? 2 : 9;
        if (this.selected[0] < 3) {
          this.move([
            this.selected[0] + 1,
            this.selected[0] === 2
              ? Math.round(this.selected[1] / 4.5)
              : this.selected[1] > max
              ? max
              : this.selected[1],
          ]);
        }
        break;
      case tvKey.KEY_LEFT:
        if (this.selected[1] > 0) {
          this.move([this.selected[0], this.selected[1] - 1]);
        }
        break;
      case tvKey.KEY_RIGHT:
        var max = this.selected[0] == 1 ? 8 : this.selected[0] == 3 ? 2 : 9;
        if (this.selected[1] < max) {
          this.move([this.selected[0], this.selected[1] + 1]);
        }
        break;
      case tvKey.KEY_ENTER:
        this.action(this.selected);
        break;
    }
  },

  move: function (selected) {
    this.selected = selected;
    var options = document.getElementsByClassName(this.id + "-option");
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
        this.upperCase();
        break;
      case "30":
        this.change();
        break;
      case "31":
        this.input.value = this.input.value + " ";
        break;
      case "32":
        this.send && this.send();
        this.destroy();
        break;
      case "29":
        this.input.value = this.input.value.slice(0, -1);
        break;
      default:
        this.input.value =
          this.input.value +
          document.getElementsByClassName(this.id + "-option")[selected[0]]
            .children[selected[1]].innerText;
        break;
    }
  },

  upperCase: function () {
    var options = document.getElementsByClassName(this.id + "-option");
    var type =
      options[0].children[0].innerText.toUpperCase() ==
      options[0].children[0].innerText;
    for (var i = 0; i < options.length; i++) {
      for (var x = 0; x < options[i].children.length; x++) {
        var child = options[i].children[x];
        child.innerText = type
          ? child.innerText.toLowerCase()
          : child.innerText.toUpperCase();
      }
    }
  },

  change: function () {
    var options = document.getElementsByClassName(this.id + "-option");
    for (var i = 0; i < options.length; i++) {
      for (var x = 0; x < options[i].children.length; x++) {
        var child = options[i].children[x];
        var newAlter = child.innerText;
        child.innerText = child.getAttribute("alter");
        child.setAttribute("alter", newAlter);
      }
    }
  },
};
