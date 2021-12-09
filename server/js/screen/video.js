var video = {
  id: "video-screen",
  previus: null,
  data: null,
};

video.init = function (id) {
  var video_element = document.createElement("div");
  video_element.id = video.id;

  service.video({
    data: {
      mac: main.mac,
      token: main.token,
      id: id,
    },
    success: function (data) {
      video.data = data.data;
      console.log(
        video.data.stream_data.streams[2].quality +
          " - " +
          video.data.stream_data.streams[2].url
      );
      player.play(
        "https://difix-cdn.cfapps.io/crunchyroll/test.m3u8|COMPONENT=HLS"
      );
    },
    error: function () {
      console.log("error");
    },
  });

  video_element.innerHTML = "";
  document.body.appendChild(video_element);

  video.previus = main.state;
  main.state = video.id;
  document.getElementById(home.id).style.display = "none";
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
