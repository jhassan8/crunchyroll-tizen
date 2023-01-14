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
};

var playbackListener = {
  onbufferingstart: function () {
    loggertest('onbufferingstart');
  },

  onbufferingprogress: function (percent) {
    //loggertest('onbufferingprogress ' + percent);
  },

  onbufferingcomplete: function () {
    loggertest('onbufferingcomplete');
  },

  oncurrentplaytime: function (currentTime) {
    //loggertest('oncurrentplaytime ' + currentTime);
    //console.log("Current playtime: " + currentTime);
  },

  onstreamcompleted: function () {
    loggertest('onstreamcompleted');
    app.stop();
  },

  onevent: function (eventType, eventData) {
    loggertest('onevent ' + eventType + ' - ' + eventData);
    console.log("eventType: " + eventType + ", " + eventData);
  },

  onerror: function (eventType) {
    loggertest('onerror ' + eventType);
  },

  ondrmevent: function (drmEvent, drmData) {
    loggertest('ondrmevent ' + drmEvent + ' - ' + drmData);
  },

  onsubtitlechange: function (duration, text, type, attriCount, attributes) {
    loggertest('onsubtitlechange');
  }
}

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
    <div class="osd">
      <div class="details">
        <div id="title">One Piece</div>
        <div id="subtitle">¡No estoy bien! La araña atrae a Sanji</div>
        <div id="description">Season 1, Episode 157</div>
      </div>
      <div class="icon rewind"></div>
      <div class="progress">
        <div id="time">1:23:44</div>
        <div class="bar">
          <div id="played">
            <div class="preview">
              <img src="https://img1.ak.crunchyroll.com/i/spire1-tmb/80d3a6cec53672bcab64ea224422cfd91651974248_fwide.jpg" id="preview">
            </div>
          </div>
        </div>
        <div id="total">2:32:43</div>
      </div>
    </div>
  </div>`;
  document.body.appendChild(video_element);

  loading.destroy();
  video.previus = main.state;
  main.state = video.id;

  player.play('https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4');
  translate.init();
};

video.destroy = function () {
  player.stop();
  main.state = this.previus;
  document.getElementById(home.id).style.display = "block";
  document.body.removeChild(document.getElementById(video.id));
};

video.keyDown = function (event) {
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
      player.resume();
      break;
    case tvKey.KEY_PAUSE:
      player.pause();
      break;
  }
};
