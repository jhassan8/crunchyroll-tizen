var video = {
  id: "video-screen",
  previous: null,
  state: 0,
  status: {
    stopped: 0,
    playing: 1,
    paused: 2,
    forward: 3,
    rewind: 4,
  },
  data: null,
  timers: {
    osd: {
      object: null,
      duration: 4000,
    },
  },
};

video.init = function (item) {
  var video_element = document.createElement("div");
  video_element.id = video.id;

  service.video({
    data: {
      id: item.stream,
    },
    success: function (data) {
      video.data = data.data;
      try {
        player.play(
          data.streams.adaptive_hls[session.storage.account.language].url
        );
      } catch (error) {
        console.log(error);
      }
      video.showOSD();
    },
    error: function (error) {
      console.log(error);
    },
  });

  video_element.innerHTML = `
  <div class="content">
    <img id="background">
    <video id="videoplayer" style="width:100%; height:100%;"></video>
    <div class="osd" id="osd">
      <div class="details">
        <div id="title">${item.serie}</div>
        <div id="subtitle">${item.episode}</div>
        <div id="description">Episode ${item.episode_number}</div>
      </div>
      <div class="progress">
        <div id="time">00:00:00</div>
        <div class="bar">
          <div id="played">
            <div class="preview">
              <img id="preview">
            </div>
          </div>
        </div>
        <div id="total">00:00:00</div>
      </div>
    </div>
    <div id="osd-icon" class="icon-status">
      <div class="icon"></div>
      <div id="osd-icon-data" class="percent"></div>
    </div>
  </div>`;
  document.body.appendChild(video_element);

  player.config(video.setPlayingTime, video.destroy);
  $(`#${home.id}`).hide();
  video.previous = main.state;
  main.state = video.id;

  //translate.init();
};

video.destroy = function () {
  player.stop();
  clearTimeout(video.timers.osd.object);
  main.state = video.previous;
  document.body.removeChild(document.getElementById(video.id));
  $(`#${home.id}`).show();
};

video.keyDown = function (event) {
  switch (event.keyCode) {
    case tvKey.KEY_STOP:
    case tvKey.KEY_BACK:
    case 27:
      video.destroy();
      break;
    case tvKey.KEY_PLAY:
      player.resume();
      break;
    case tvKey.KEY_PAUSE:
      player.pause();
      break;
    case tvKey.KEY_PLAY_PAUSE:
      player.playPause();
    break;
    case tvKey.KEY_ENTER:
    case tvKey.KEY_PANEL_ENTER:
      document.getElementById("osd").style.opacity == 1 && player.playPause();
      break;
    case tvKey.KEY_LEFT:
      player.rewind(video.setPlayingTime);
      break;
    case tvKey.KEY_RIGHT:
      player.forward(video.setPlayingTime);
      break;
  }
  video.showOSD();
};

video.showOSD = function () {
  clearTimeout(video.timers.osd.object);
  var osd = document.getElementById("osd");
  osd.style.opacity = 1;
  video.timers.osd.object = setTimeout(() => {
    video.hideOSD();
  }, video.timers.osd.duration);
};

video.hideOSD = function () {
  video.timers.osd.object = null;
  var osd = document.getElementById("osd");
  osd.style.opacity = 0;
};

video.showBTN = function (state, data) {
  var button = document.getElementById("osd-icon");
  button.style.opacity = 1;
  button.className = `icon-status ${state}`;
  document.getElementById("osd-icon-data").innerText = data;
};

video.hideBTN = function () {
  var button = document.getElementById("osd-icon");
  button.style.opacity = 0;
};

video.setPlayingTime = function () {
  var time = player.getPlayed() + player.values.forward_rewind;
  time = time < 0 ? 0 : time;
  var totalTime = player.getDuration();
  var timePercent = (100 * time) / totalTime;

  var totalSeconds = Math.floor(totalTime % 60);
  var totalMinutes = Math.floor((totalTime % 3600) / 60);
  var totalHours = Math.floor(totalTime / 3600);
  totalHours = totalHours < 10 ? "0" + totalHours : totalHours;
  totalMinutes = totalMinutes < 10 ? "0" + totalMinutes : totalMinutes;
  totalSeconds = totalSeconds < 10 ? "0" + totalSeconds : totalSeconds;

  var timeSeconds = Math.floor(time % 60);
  var timeMinutes = Math.floor((time % 3600) / 60);
  var timeHours = Math.floor(time / 3600);
  timeHours = timeHours < 10 ? "0" + timeHours : timeHours;
  timeMinutes = timeMinutes < 10 ? "0" + timeMinutes : timeMinutes;
  timeSeconds = timeSeconds < 10 ? "0" + timeSeconds : timeSeconds;

  document.getElementById(
    "time"
  ).innerText = `${timeHours}:${timeMinutes}:${timeSeconds}`;
  document.getElementById(
    "total"
  ).innerText = `${totalHours}:${totalMinutes}:${totalSeconds}`;
  document.getElementById("played").style.width = timePercent + "%";
};
