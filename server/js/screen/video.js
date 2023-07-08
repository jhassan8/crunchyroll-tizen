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
  subtitles: [],
  subtitle: null,
  audios: [],
  audio: null,
  intro: null,
  streams: [],
  timers: {
    history: {
      object: null,
      duration: 30000,
    },
    next: null,
    osd: {
      object: null,
      duration: 4000,
    },
  },
  settings: {
    open: false,
    selected: false,
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
        <div class="player-settings">
          <i id="player-settings" class="fa-solid fa-gear"></i>
        </div>
        <div class="details">
          <div id="title">${item.serie}</div>
          <div id="subtitle">${item.season_number}x${item.episode_number} - ${item.episode}</div>
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

      <div id="skip-intro">
        <i class="fa-solid fa-forward"></i>
        SKIP INTRO
      </div>

      <div class="settings-slide">
        <div id="languages-content">
          <div class="title">Audios</div>
          <ul id="audios"></ul>
          <div class="title">Subtitles</div>
          <ul id="subtitles"></ul>
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
    clearInterval(video.timers.history.object);
    main.state = video.previous;
    document.body.removeChild(document.getElementById(video.id));
    $(`#${home.id}`).show();
    video.next.episode = null;
    video.next.status = false;
    video.next.shown = false;
    video.episode = null;
    video.data = null;
    video.streams = [];
  },

  keyDown: function (event) {
    var osd = true;
    switch (event.keyCode) {
      case tvKey.KEY_STOP:
      case tvKey.KEY_BACK:
      case 27:
        if (video.settings.open) {
          osd = false;
          video.settings.open = false;
          $(".settings-slide").removeClass("open");
          $("#osd-icon").show();
          video.settings.selected = false;
          $("#player-settings").removeClass("selected");
          $("#player-settings").show();
          player.resume();
        } else {
          if (video.next.status) {
            video.stopNext();
          } else {
            video.destroy();
          }
        }
        break;
      case tvKey.KEY_PLAY:
        !video.settings.open && player.resume();
        break;
      case tvKey.KEY_PAUSE:
        !video.settings.open && player.pause();
        break;
      case tvKey.KEY_PLAY_PAUSE:
        !video.settings.open && player.playPause();
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        if (video.settings.open) {
          osd = false;
          var selected = $("#languages-content .option.selected");
          var isAudio = selected.parent().attr("id") === "audios";
          var active = selected.parent().children(".option.active");

          if (active[0] !== selected[0]) {
            var options = selected.parent().children(".option");

            options.removeClass("active");
            selected.addClass("active");

            isAudio
              ? video.changeAudio(options.index(selected[0]))
              : video.changeSubtitle(options.index(selected[0]));
          }
        } if(video.intro && video.intro.state) {
          osd = false;
          player.forwardTo(video.intro.end);
        } else {
          if (video.next.status) {
            clearInterval(video.timers.next);
            video.playNext();
          } else {
            if (document.getElementById("osd").style.opacity == 1) {
              if (!video.settings.selected) {
                player.playPause();
              } else {
                video.hideOSD();
                video.settings.open = true;
                $("#player-settings").hide();
                $("#osd-icon").hide();
                player.pause();
                $(".settings-slide").addClass("open");
                video.setAudios();
                video.setSubtitles();
              }
            }
          }
        }
        break;
      case tvKey.KEY_PREVIOUS:
      case tvKey.KEY_LEFT:
        !video.settings.open && player.rewind(video.setPlayingTime);
        break;
      case tvKey.KEY_RIGHT:
      case tvKey.KEY_NEXT:
        !video.settings.open && player.forward(video.setPlayingTime);
        break;
      case tvKey.KEY_UP:
        if (video.settings.open) {
          var options = $("#languages-content .option");
          var current = options.index($("#languages-content .option.selected"));

          options.removeClass("selected");

          var newCurrent = current > 0 ? current - 1 : current;
          options.eq(newCurrent).addClass("selected");

          var listSelected = $("#languages-content .option.selected").parent();

          var marginTop = 0;
          var max = listSelected.attr("id") === "audios" ? 4 : 3;
          var currentInList = listSelected
            .children()
            .index($("#languages-content .option.selected"));
          if (listSelected.children().length > max && currentInList > max - 1) {
            if (currentInList > listSelected.children().length - (max - 1)) {
              marginTop = -((listSelected.children().length - max) * 82);
            } else {
              marginTop = -((currentInList - (max - 1)) * 82);
            }
          }

          listSelected.children().first()[0].style.marginTop = `${marginTop}px`;
        } else {
          if (document.getElementById("osd").style.opacity == 1) {
            video.settings.selected = true;
            $("#player-settings").addClass("selected");
          }
        }
        break;
      case tvKey.KEY_DOWN:
        if (video.settings.open) {
          var options = $("#languages-content .option");
          var current = options.index($("#languages-content .option.selected"));

          options.removeClass("selected");

          var newCurrent = current < options.length - 1 ? current + 1 : current;
          options.eq(newCurrent).addClass("selected");

          var listSelected = $("#languages-content .option.selected").parent();

          var marginTop = 0;
          var max = listSelected.attr("id") === "audios" ? 4 : 3;
          var currentInList = listSelected
            .children()
            .index($("#languages-content .option.selected"));
          if (listSelected.children().length > max && currentInList > max - 1) {
            if (currentInList > listSelected.children().length - (max - 1)) {
              marginTop = -((listSelected.children().length - max) * 82);
            } else {
              marginTop = -((currentInList - (max - 1)) * 82);
            }
          }

          listSelected.children().first()[0].style.marginTop = `${marginTop}px`;
        } else {
          video.settings.selected = false;
          $("#player-settings").removeClass("selected");
        }
        break;
    }
    !video.settings.open && osd && video.showOSD();
  },

  end: function () {
    if (video.next.status) {
      video.playNext();
    } else {
      video.destroy();
    }
  },

  play: function (item, noplay) {
    video.episode = item.id;
    service.video({
      data: {
        id: item.stream,
      },
      success: function (data) {
        video.stopNext();
        video.setSkipIntro(item.id);
        video.next.shown = false;
        try {
          video.streams = data.streams.adaptive_hls;

          var lang;
          if (video.streams[session.storage.account.language]) {
            lang = session.storage.account.language;
          } else {
            lang = "";
          }

          video.audio = data.audio_locale;
          video.audios = [{ name: video.audio, id: 0 }];

          if (data.versions) {
            video.audios = data.versions.map((element) => ({
              name: element.audio_locale,
              id: element.media_guid,
            }));
          }

          video.subtitle = lang;
          video.subtitles = Object.keys(video.streams).map((element) => ({
            name: element,
          }));

          player.play(
            video.streams[lang].url,
            item.playhead === item.duration ? 0 : item.playhead,
            noplay
          );
          video.startHistory();
          video.setAudios();
          video.setSubtitles();
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

  setSkipIntro: function (id) {
    service.intro({
      data: {
        id,
      },
      success: function (data) {
        if (data.duration && data.duration > 10) {
          video.intro = {
            start: data.startTime + 2,
            end: data.endTime - 2,
            state: false,
          };
        } else {
          video.intro = null;
        }
      },
      error: function (error) {
        console.log(error);
      },
    });
  },

  showSkip: function (time) {
    if (time > video.intro.end) {
      video.intro.state = true;
      $("#skip-intro").hide();
    }

    if (!video.intro.state && time > video.intro.start && time < video.intro.end) {
      video.intro.state = true;
      $("#skip-intro").show();
    }
  },

  setAudios: function () {
    $("#audios li").remove();
    var audios = "";
    video.audios.forEach((element, index) => {
      audios += `<li class="option${
        element.name === video.audio ? " active selected" : ""
      }">${session.languages[element.name]}</li>`;
    });

    document.getElementById("audios").innerHTML = audios;
  },

  changeAudio: function (index) {
    video.play(
      {
        id: video.episode,
        stream: video.audios[index].id,
        playhead: player.getPlayed() / 60,
        duration: player.getDuration(),
      },
      true
    );
    video.setSubtitles();
  },

  setSubtitles: function () {
    $("#subtitles").html("");
    var subtitles = "";
    video.subtitles.forEach((element) => {
      subtitles += `<li class="option${
        element.name === video.subtitle ? " active" : ""
      }">${session.languages[element.name]}</li>`;
    });

    document.getElementById("subtitles").innerHTML = subtitles;
  },

  changeSubtitle: function (index) {
    player.play(
      video.streams[video.subtitles[index].name].url,
      player.getPlayed() / 60,
      true
    );
  },

  stopNext: function () {
    clearInterval(video.timers.next);
    video.next.status = false;
    video.next.episode = null;
    document.getElementById("next-episode-count").innerText = video.next.time;
    $(".next-episode").hide();
  },

  playNext: function () {
    video.saveHistory(Math.floor(player.getDuration()));
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

  startHistory: function () {
    clearInterval(video.timers.history.object);
    video.timers.history.object = setInterval(() => {
      video.saveHistory();
    }, video.timers.history.duration);
  },

  saveHistory: function (time) {
    service.setHistory({
      data: {
        content_id: video.episode,
        playhead: time || Math.floor(player.getPlayed()),
      },
      success: function () {},
      error: function (error) {
        console.log(error);
      },
    });
  },

  setPlayingTime: function () {
    var time = player.getPlayed() + player.values.forward_rewind;
    time = time < 0 ? 0 : time;
    var totalTime = player.getDuration();
    var timePercent = (100 * time) / totalTime;

    video.intro && video.showSkip(time);

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
