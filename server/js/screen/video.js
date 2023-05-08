window.video = {
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
  episode: null,
  next: {
    shown: false,
    state: false,
    time: 60,
    episode: null,
  },
  data: null,
  timers: {
    next: null,
    osd: {
      object: null,
      duration: 4000,
    },
  },

  init: function (item) {
    var video_element = document.createElement("div");
    video_element.id = video.id;

    video.play(item);

    video_element.innerHTML = `
    <div class="content">
      <img id="background" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=">
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
      <div class="next-episode">
        <div class="next-episode-image">
          <img id="next-episode-image">
          <div id="next-episode-count">${video.next.time}</div>
        </div>
      </div>
    </div>`;
    document.body.appendChild(video_element);

    player.config(video.setPlayingTime, video.end);
    $(`#${home.id}`).hide();
    video.previous = main.state;
    main.state = video.id;

    //translate.init();
  },

  destroy: function () {
    player.stop();
    clearTimeout(video.timers.osd.object);
    clearInterval(video.timers.next);
    main.state = video.previous;
    document.body.removeChild(document.getElementById(video.id));
    $(`#${home.id}`).show();
    video.next.episode = null;
    video.next.status = false;
    video.next.shown = false;
    video.episode = null;
    video.data = null;
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_STOP:
      case tvKey.KEY_BACK:
      case 27:
        if (video.next.status) {
          video.stopNext();
        } else {
          video.destroy();
        }
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
        if (video.next.status) {
          clearInterval(video.timers.next);
          video.playNext();
        } else {
          document.getElementById("osd").style.opacity == 1 &&
            player.playPause();
        }
        break;
      case tvKey.KEY_PREVIOUS:
      case tvKey.KEY_LEFT:
        player.rewind(video.setPlayingTime);
        break;
      case tvKey.KEY_RIGHT:
      case tvKey.KEY_NEXT:
        player.forward(video.setPlayingTime);
        break;
    }
    video.showOSD();
  },

  end: function () {
    if (video.next.status) {
      video.playNext();
    } else {
      video.destroy();
    }
  },

  play: function (item) {
    video.episode = item.id;
    service.video({
      data: {
        id: item.stream,
      },
      success: function (data) {
        video.stopNext();
        video.next.shown = false;
        video.data = data.data;
        try {
          var lang;
          if (data.streams.adaptive_hls[session.storage.account.language]) {
            lang = session.storage.account.language;
          } else {
            lang = "";
          }
          player.play(data.streams.adaptive_hls[lang].url);
        } catch (error) {
          console.log(error);
        }
        video.showOSD();
      },
      error: function (error) {
        video.stopNext();
        video.next.shown = false;
        console.log(error);
      },
    });
  },

  stopNext: function () {
    clearInterval(video.timers.next);
    video.next.status = false;
    video.next.episode = null;
    document.getElementById("next-episode-count").innerText = video.next.time;
    $(".next-episode").hide();
  },

  playNext: function () {
    video.play(video.next.episode);
    $(".osd #title").text(video.next.episode.serie);
    $(".osd #subtitle").text(video.next.episode.episode);
    $(".osd #description").text(`Episode ${video.next.episode.episode_number}`);
  },

  nextEpisode: function () {
    video.next.shown = true;
    try {
      service.continue({
        data: {
          ids: video.episode,
        },
        success: function (data) {
          video.next.episode = mapper.continue(data);
          document
            .getElementById("next-episode-image")
            .setAttribute("src", video.next.episode.background);
          $(".next-episode").show();
          video.next.status = true;
          video.timers.next = setInterval(() => {
            var value = document.getElementById("next-episode-count").innerText;
            if (+value === 1) {
              clearInterval(video.timers.next);
            } else {
              document.getElementById("next-episode-count").innerText =
                value - 1;
            }
          }, 1000);
        },
        error: function (error) {
          console.log(error);
        },
      });
    } catch (error) {
      console.log(error);
    }
  },

  showOSD: function () {
    clearTimeout(video.timers.osd.object);
    var osd = document.getElementById("osd");
    osd.style.opacity = 1;
    video.timers.osd.object = setTimeout(() => {
      video.hideOSD();
    }, video.timers.osd.duration);
  },

  hideOSD: function () {
    video.timers.osd.object = null;
    var osd = document.getElementById("osd");
    osd.style.opacity = 0;
  },

  showBTN: function (state, data) {
    var button = document.getElementById("osd-icon");
    button.style.opacity = 1;
    button.className = `icon-status ${state}`;
    document.getElementById("osd-icon-data").innerText = data;
  },

  hideBTN: function () {
    var button = document.getElementById("osd-icon");
    button.style.opacity = 0;
  },

  setPlayingTime: function () {
    var time = player.getPlayed() + player.values.forward_rewind;
    time = time < 0 ? 0 : time;
    var totalTime = player.getDuration();
    var timePercent = (100 * time) / totalTime;

    if (
      !video.next.shown &&
      player.state === player.states.PLAYING &&
      time >= totalTime - (video.next.time + 2)
    ) {
      video.nextEpisode();
    }

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

    document.getElementById("time").innerText = `${
      timeHours ? timeHours : "00"
    }:${timeMinutes ? timeMinutes : "00"}:${timeSeconds ? timeSeconds : "00"}`;
    document.getElementById("total").innerText = `${
      totalHours ? totalHours : "00"
    }:${totalMinutes ? totalMinutes : "00"}:${
      totalSeconds ? totalSeconds : "00"
    }`;
    document.getElementById("played").style.width = timePercent + "%";
  },
};
