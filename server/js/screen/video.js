var video = {
  id: "video-screen",
  previus: null,
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

video.init = function (id) {
  var video_element = document.createElement("div");
  video_element.id = video.id;

  service.video({
    data: {
      media_id: id,
    },
    success: function (data) {
      video.data = data.data;
      try {
        player.play(video.byQuality(video.data.stream_data.streams).url);
      } catch (error) {
        console.log(error);
      }
      video.showOSD();
    },
    error: function () {
      console.log("error");
    },
  });

  video_element.innerHTML = `
  <div class="content">
    <img id="background">
    <object id="videoplayer" type="application/avplayer" style="width:100%; height:100%;"></object>
    <div class="osd" id="osd">
      <div class="details">
        <div id="title">${home.data.series[home.selected.serie].name}</div>
        <div id="subtitle">${
          home.data.episodes[home.selected.episode].name
        }</div>
        <div id="description">Episode ${
          home.data.episodes[home.selected.episode].episode_number
        }</div>
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

  home.hide();
  video.previus = main.state;
  main.state = video.id;

  //translate.init();
};

video.byQuality = function (data) {
  var stream;
  var quality =
    session.info.settings.quality === "fhd"
      ? "high"
      : session.info.settings.quality === "hd"
      ? "mid"
      : session.info.settings.quality === "sd"
      ? "low"
      : "adaptive";
  
  data.forEach((element) => {
    if (element.quality === quality) {
      stream = element;
    }
  });

  stream = stream ? stream : data[0];
  if (!stream) {
    throw new Error("empty videos");
  }

  return stream;
};

video.destroy = function () {
  player.stop();
  main.state = video.previus;
  document.body.removeChild(document.getElementById(video.id));
  home.show();
};

video.keyDown = function (event) {
  video.showOSD();
  switch (event.keyCode) {
    case tvKey.KEY_BACK:
    case 27:
      video.destroy();
      break;
    case tvKey.KEY_VOL_UP:
    case tvKey.KEY_PANEL_VOL_UP:
      audio.setRelativeVolume(0);
      break;
    case tvKey.KEY_VOL_DOWN:
    case tvKey.KEY_PANEL_VOL_DOWN:
      audio.setRelativeVolume(1);
      break;
    case tvKey.KEY_PLAY:
      player.resume();
      break;
    case tvKey.KEY_PAUSE:
      player.pause();
      break;
    case tvKey.KEY_STOP:
      player.stop();
      break;
  }
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

video.setPlayingTime = function (time) {
  var totalTime = player.getDuration();
  var timePercent = (100 * time) / totalTime;

  var totalSeconds = Math.floor((totalTime / 1000) % 60);
  var totalMinutes = Math.floor((totalTime / (1000 * 60)) % 60);
  var totalHours = Math.floor((totalTime / (1000 * 60 * 60)) % 24);
  totalHours = totalHours < 10 ? "0" + totalHours : totalHours;
  totalMinutes = totalMinutes < 10 ? "0" + totalMinutes : totalMinutes;
  totalSeconds = totalSeconds < 10 ? "0" + totalSeconds : totalSeconds;

  var timeSeconds = Math.floor((time / 1000) % 60);
  var timeMinutes = Math.floor((time / (1000 * 60)) % 60);
  var timeHours = Math.floor((time / (1000 * 60 * 60)) % 24);
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
