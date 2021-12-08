var keyboard = {
  id: "keyboard-screen",
  previus: null,
  selected: [0, 0],
  input: null,
};

keyboard.init = function (element) {
  this.input = element;
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
      padding: false,
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
      padding: true,
    },
    {
      keys: [
        { value: "Z", number: ".", size: 1 },
        { value: "X", number: "¿", size: 1 },
        { value: "C", number: "?", size: 1 },
        { value: "V", number: "¡", size: 1 },
        { value: "B", number: "!", size: 1 },
        { value: "N", number: ";", size: 1 },
        { value: "M", number: ":", size: 1 },
        { value: "Ñ", number: ",", size: 1 },
        { value: "", number: "", size: "a" },
      ],
      padding: true,
    },
    {
      keys: [
        { value: "1 2 3", number: "A B C", size: 2 },
        {
          value: "__________________________",
          number: "__________________________",
          size: 5,
        },
        { value: "HECHO", number: "HECHO", size: 2 },
      ],
      padding: true,
    },
  ];

  var keyboard_element = document.createElement("div");
  keyboard_element.id = this.id;

  var htmlString = "";

  for (var i = 0; i < values.length; i++) {
    htmlString +=
      '<div class="' +
      this.id +
      "-option row" +
      (values[i].padding ? " padding" : "") +
      '">';
    for (var a = 0; a < values[i].keys.length; a++) {
      htmlString +=
        '<div class="col size-' +
        values[i].keys[a].size +
        '" alter="' +
        values[i].keys[a].number +
        '">' +
        values[i].keys[a].value +
        "</div>";
    }
    htmlString += "</div>";
  }

  keyboard_element.innerHTML = htmlString;
  document.body.appendChild(keyboard_element);

  this.move(this.selected);
  this.previus = main.state;
  main.state = this.id;
};

keyboard.destroy = function () {
  document.body.removeChild(document.getElementById(this.id));
  main.state = this.previus;
};

keyboard.keyDown = function (event) {
  switch (event.keyCode) {
    case tvKey.KEY_RETURN:
    case tvKey.KEY_PANEL_RETURN:
      widgetAPI.blockNavigation(event);
      this.destroy();
      break;
    case tvKey.KEY_UP:
      if (this.selected[0] > 0) {
        this.move([this.selected[0] - 1, this.selected[1]]);
      }
      break;
    case tvKey.KEY_DOWN:
      var max =
        this.selected[0] + 1 == 0 ? 9 : this.selected[0] + 1 == 3 ? 2 : 8;
      if (this.selected[0] < 3) {
        this.move([
          this.selected[0] + 1,
          this.selected[1] > max ? max : this.selected[1],
        ]);
      }
      break;
    case tvKey.KEY_LEFT:
      if (this.selected[1] > 0) {
        this.move([this.selected[0], this.selected[1] - 1]);
      }
      break;
    case tvKey.KEY_RIGHT:
      var max = this.selected[0] == 0 ? 9 : this.selected[0] == 3 ? 2 : 8;
      if (this.selected[1] < max) {
        this.move([this.selected[0], this.selected[1] + 1]);
      }
      break;
    case tvKey.KEY_ENTER:
    case tvKey.KEY_PANEL_ENTER:
      this.action(this.selected);
      break;
  }
};

keyboard.move = function (selected) {
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
};

keyboard.action = function (selected) {
  switch (selected[0] + "" + selected[1]) {
    case "30":
      this.change();
      break;
    case "31":
      this.input.value = this.input.value + " ";
      break;
    case "32":
      this.destroy();
      break;
    case "28":
      this.input.value = this.input.value.slice(0, -1);
      break;
    default:
      this.input.value =
        this.input.value +
        document.getElementsByClassName(this.id + "-option")[selected[0]]
          .children[selected[1]].innerText;
      break;
  }
};

keyboard.change = function () {
  var options = document.getElementsByClassName(this.id + "-option");
  for (var i = 0; i < options.length; i++) {
    var cols = options[i].children;
    for (var a = 0; a < cols.length; a++) {
      var newAlter = cols[a].innerText;
      cols[a].innerText = cols[a].getAttribute("alter");
      cols[a].setAttribute("alter", newAlter);
    }
  }
};
