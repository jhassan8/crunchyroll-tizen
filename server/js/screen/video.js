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
    }
  }
};

video.init = function (id) {
  var video_element = document.createElement("div");
  video_element.id = video.id;

  //service.video({
  //  data: {
  //    media_id: id,
  //  },
  //  success: function (data) {
  //    video.data = data.data;
  //    console.log(data.data);
  //    //player.play(
  //    //  "https://difix-cdn.cfapps.io/crunchyroll/test.m3u8|COMPONENT=HLS"
  //    //);
  //  },
  //  error: function () {
  //    console.log("error");
  //  },
  //});
  // <img src="https://img1.ak.crunchyroll.com/i/spire1-tmb/80d3a6cec53672bcab64ea224422cfd91651974248_fwide.jpg" id="background">

  video_element.innerHTML = `
  <div class="content">
    <img src="https://img1.ak.crunchyroll.com/i/spire1-tmb/80d3a6cec53672bcab64ea224422cfd91651974248_fwide.jpg" id="background">
    <object id="videoplayer" type="application/avplayer" style="width:100%; height:100%;"></object>
    <div class="osd" id="osd">
      <div class="details">
        <div id="title">One Piece</div>
        <div id="subtitle">¡No estoy bien! La araña atrae a Sanji</div>
        <div id="description">Season 1, Episode 157</div>
      </div>
      <div class="progress">
        <div id="time">00:00:00</div>
        <div class="bar">
          <div id="played">
            <div class="preview">
              <img src="https://img1.ak.crunchyroll.com/i/spire1-tmb/80d3a6cec53672bcab64ea224422cfd91651974248_fwide.jpg" id="preview">
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

  loading.destroy();
  video.previus = main.state;
  main.state = video.id;

  player.play('https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4');
  video.showOSD();
  translate.init();
};

video.destroy = function () {
  player.stop();
  main.state = this.previus;
  document.getElementById(home.id).style.display = "block";
  document.body.removeChild(document.getElementById(video.id));
};

video.keyDown = function (event) {
  loggertest(event.keyCode);
  video.showOSD();
  switch (event.keyCode) {
    case tvKey.KEY_RETURN:
    case tvKey.KEY_PANEL_RETURN:
      widgetAPI.blockNavigation(event);
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
      loggertest('KEY_PLAY');
      player.resume();
      break;
    case tvKey.KEY_PAUSE:
      loggertest('KEY_PLAY');
      player.pause();
      break;
    case tvKey.KEY_STOP:
      loggertest('KEY_STOP');
      player.stop();
      break;
  }
};

video.showOSD = function() {
  clearTimeout(video.timers.osd.object);
  let osd = document.getElementById("osd");
  osd.style.opacity = 1;
  video.timers.osd.object = setTimeout(() => {
    video.hideOSD()
  }, video.timers.osd.duration);
}

video.hideOSD = function() {
  video.timers.osd.object = null;
  let osd = document.getElementById("osd");
  osd.style.opacity = 0;
}

video.showBTN = function(state, data) {
  let button = document.getElementById("osd-icon");
  button.style.opacity = 1;
  button.className = `icon-status ${state}`;
  document.getElementById("osd-icon-data").innerText = data;
}

video.hideBTN = function() {
  let button = document.getElementById("osd-icon");
  button.style.opacity = 0;
}

video.setPlayingTime = function(time) {
  let totalTime = player.getDuration();
  let timePercent = (100 * time) / totalTime;

  let totalSeconds = Math.floor((totalTime / 1000) % 60);
  let totalMinutes = Math.floor((totalTime / (1000 * 60)) % 60);
  let totalHours = Math.floor((totalTime / (1000 * 60 * 60)) % 24);
  totalHours = (totalHours < 10) ? "0" + totalHours : totalHours;
  totalMinutes = (totalMinutes < 10) ? "0" + totalMinutes : totalMinutes;
  totalSeconds = (totalSeconds < 10) ? "0" + totalSeconds : totalSeconds;

  let timeSeconds = Math.floor((time / 1000) % 60);
  let timeMinutes = Math.floor((time / (1000 * 60)) % 60);
  let timeHours = Math.floor((time / (1000 * 60 * 60)) % 24);
  timeHours = (timeHours < 10) ? "0" + timeHours : timeHours;
  timeMinutes = (timeMinutes < 10) ? "0" + timeMinutes : timeMinutes;
  timeSeconds = (timeSeconds < 10) ? "0" + timeSeconds : timeSeconds;

  document.getElementById("time").innerText = `${timeHours}:${timeMinutes}:${timeSeconds}`;
  document.getElementById("total").innerText = `${totalHours}:${totalMinutes}:${totalSeconds}`;
  document.getElementById("played").style.width = timePercent + "%";
}
