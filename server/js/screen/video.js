window.video = {
  id: "video-screen",
  previous: null,
  episode: null,
  token: null,
  speed: {
    options: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
    active: 1,
    state: false,
  },
  next: {
    shown: false,
    state: false,
    time: 60,
    episode: null,
  },
  option: false,
  options: [
    {
      icon: "fa-solid fa-forward-step",
      action: "nextEpisode",
      param: true,
    },
    {
      icon: "fa-solid fa-play playback-speed",
      action: "playbackSpeed",
      param: true,
    },
    {
      icon: "fa-solid fa-message",
      action: "openLanguages",
    },
    {
      icon: "toggle-aspect fa-solid fa-expand",
      action: "toggleAspectRatio",
    },
  ],
  aspects: ["expand", "compress", "crop-simple"],
  aspect: 0,
  subtitles: [],
  subtitle: null,
  audios: [],
  audio: null,
  intro: null,
  credits: null,
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

  toggleAspectRatio: function () {
    video.aspect =
      video.aspect < video.aspects.length - 1 ? video.aspect + 1 : 0;
    document.getElementById("videoplayer").className =
      video.aspects[video.aspect];
    $(".toggle-aspect")[0].className = `toggle-aspect fa-solid fa-${
      video.aspects[video.aspect]
    } selected`;
  },

  openLanguages: function () {
    video.hideOSD();
    video.settings.open = true;
    player.pause();
    $("#osd-icon").hide();
    $(".player-settings").hide();
    video.setAudios();
    video.setSubtitles();
    $(".settings-slide").addClass("open");
  },

  getSettings: function () {
    return video.options
      .map((element) => `<i class="${element.icon}"></i>`)
      .join("");
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
          <div id="setting-options">
            ${video.getSettings()}
          </div>
        </div>
        <div class="details">
          <div id="title">${item.serie}</div>
          <div id="subtitle">
            ${item.season_number}x${item.episode_number} - ${item.episode}
          </div>
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
          <div id="next-episode-count"></div>
        </div>
      </div>

      <div id="skip-intro">
        <i class="fa-solid fa-forward"></i>
        ${translate.go("video.skip")}
      </div>

      <div class="settings-slide">
        <div id="languages-content">
          <div class="title">${translate.go("video.languages.audios")}</div>
          <ul id="audios"></ul>
          <div class="title">${translate.go("video.languages.subtitles")}</div>
          <ul id="subtitles"></ul>
        </div>
      </div>
    </div>`;
    document.body.appendChild(video_element);

    $(`#${home.id}`).hide();
    video.previous = main.state;
    main.state = video.id;
  },

  destroy: function () {
    video.hideOSD();
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
    video.speed.state = false;
    video.speed.active = 1;
  },

  keyDown: function (event) {
    var osd = true;
    switch (event.keyCode) {
      case tvKey.KEY_STOP:
      case tvKey.IS_KEY_BACK(event.keyCode):
        if (video.settings.open) {
          osd = false;
          video.settings.open = false;
          $(".settings-slide").removeClass("open");
          $("#osd-icon").show();
          video.settings.selected = false;
          $("#setting-options").removeClass("selected");
          $(".player-settings").show();
          player.resume();
        } else {
          if (video.next.status) {
            video.stopNext();
          } else if (video.speed.state) {
            video.hidePlaySpeed();
            video.showOSD();
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
        }
        if (video.intro && video.intro.state) {
          osd = false;
          player.forwardTo(video.intro.end);
        } else {
          if (video.next.status) {
            clearInterval(video.timers.next);
            video.playNext();
          } else {
            if (document.getElementById("osd").style.opacity == 1) {
              if (!video.option) {
                player.playPause();
              } else {
                var selected = $("#setting-options i").index(
                  $("#setting-options i.selected")
                );
                osd = !video[video.options[selected].action](
                  video.options[selected].param
                );
              }
            }
          }
        }
        break;
      case tvKey.KEY_PREVIOUS:
      case tvKey.KEY_LEFT:
        if (video.option) {
          if (video.speed.state) {
            osd = false;
            video.setSpeed(-1);
          } else {
            var options = $("#setting-options i");
            var selected = options.index($("#setting-options i.selected"));
            options.removeClass("selected");
            options
              .eq(selected > 0 ? selected - 1 : selected)
              .addClass("selected");
          }
        } else {
          !video.settings.open && player.rewind(video.setPlayingTime);
        }
        break;
      case tvKey.KEY_RIGHT:
      case tvKey.KEY_NEXT:
        if (video.option) {
          if (video.speed.state) {
            osd = false;
            video.setSpeed(1);
          } else {
            var options = $("#setting-options i");
            var selected = options.index($("#setting-options i.selected"));
            options.removeClass("selected");
            options
              .eq(selected < video.options.length - 1 ? selected + 1 : selected)
              .addClass("selected");
          }
        } else {
          !video.settings.open && player.forward(video.setPlayingTime);
        }
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
          if (
            document.getElementById("osd").style.opacity == 1 &&
            !video.option
          ) {
            $("#setting-options").children().first().addClass("selected");
            video.option = true;
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
        } else if (video.speed.state) {
          video.hidePlaySpeed();
          video.showOSD();
        } else {
          video.option = false;
          $("#setting-options").children().removeClass("selected");
        }
        break;
    }
    !video.settings.open && !video.speed.state && osd && video.showOSD();
  },

  end: function () {
    if (video.next.status) {
      video.playNext();
    } else {
      video.destroy();
    }
  },

  play: function (item, noplay, forceSubtitle) {
    video.episode = item.id;
    service.video_v2({
      data: {
        id: item.id,
      },
      success: function (data) {
        video.token = data.token;
        video.stopNext();
        video.setSkipIntro(item.id);
        video.next.shown = false;
        try {
          video.audio = data.audioLocale;
          video.audios = [{ name: video.audio, id: item.id }];
          if (data.versions) {
            video.audios = data.versions.map((element) => ({
              name: element.audio_locale,
              id: element.guid,
            }));
          }

          if (!forceSubtitle) {
            video.subtitle = data.hardSubs[session.storage.account.language]
              ? session.storage.account.language
              : "Disabled";
            video.subtitle =
              video.subtitle === "Disabled" &&
              data.hardSubs[session.storage.account.audio]
                ? session.storage.account.audio
                : video.subtitle;
          } else {
            video.subtitle = forceSubtitle;
          }
          video.subtitles = data.hardSubs
            ? Object.keys(data.hardSubs).map((element) => ({
                name: element,
                url: data.hardSubs[element].url,
              }))
            : [];

          video.subtitles.unshift({ name: "Disabled", url: data.url });
          var subtitleIndex = video.subtitles.findIndex(
            (e) => e.name === video.subtitle
          );

          player.play(
            { token: data.token, id: item.id },
            video.subtitles[subtitleIndex].url,
            item.playhead === item.duration ? 0 : item.playhead,
            noplay
          );
          video.startHistory();
          video.setAudios();
          video.setSubtitles();
        } catch (error) {
          console.log(error);
        }

        setTimeout(() => {
          player.deleteSession({
            data: {
              id: video.episode,
              token: video.token,
            },
          });
        }, 3000);
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
        if (data.intro && data.intro.end) {
          video.intro = {
            start: data.intro.start,
            end: data.intro.end,
            state: false,
          };
        } else {
          video.intro = null;
        }

        if (data.credits && data.credits.end) {
          video.credits = {
            start: data.credits.start,
            end: data.credits.end,
            state: false,
          };
          document.getElementById("next-episode-count").innerText = video.credits.end - video.credits.start;
        } else {
          video.credits = null;
        }
      },
      error: function (error) {
        console.log(error);
      },
    });
  },

  showSkip: function (time) {
    if (time > video.intro.end) {
      video.intro.state = false;
      $("#skip-intro").hide();
    } else {
      if (
        !video.intro.state &&
        time > video.intro.start &&
        time < video.intro.end
      ) {
        video.intro.state = true;
        $("#skip-intro").show();
      }
    }
  },

  setAudios: function () {
    $("#audios li").remove();
    var audios = "";
    video.audios.forEach((element, index) => {
      audios += `<li class="option${
        element.name === video.audio ? " active selected" : ""
      }">${session.languages.audios[element.name]}</li>`;
    });

    document.getElementById("audios").innerHTML = audios;
  },

  changeAudio: function (index) {
    video.play(
      {
        id: video.audios[index].id,
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
      }">${session.languages.subtitles[element.name]}</li>`;
    });

    document.getElementById("subtitles").innerHTML = subtitles;
  },

  changeSubtitle: function (index) {
    video.play(
      {
        id: video.episode,
        playhead: player.getPlayed() / 60,
        duration: player.getDuration(),
      },
      true,
      video.subtitles[index].name
    );
  },

  stopNext: function () {
    clearInterval(video.timers.next);
    video.next.status = false;
    video.next.episode = null;
    $(".next-episode").hide();
  },

  playNext: function () {
    video.saveHistory(Math.floor(player.getDuration()));
    video.play(video.next.episode);
    $(".osd #title").text(video.next.episode.serie);
    $(".osd #subtitle").text(
      `${video.next.episode.season_number}x${video.next.episode.episode_number} - ${video.next.episode.episode}`
    );
  },

  nextEpisode: function (instant) {
    video.next.shown = true;
    try {
      service.continue({
        data: {
          ids: video.episode,
        },
        success: function (data) {
          video.next.episode = mapper.continue(data);

          if (instant) {
            video.playNext();
          } else {
            document
              .getElementById("next-episode-image")
              .setAttribute("src", video.next.episode.background);
            $(".next-episode").show();
            video.next.status = true;
            video.timers.next = setInterval(() => {
              var value =
                document.getElementById("next-episode-count").innerText;
              if (+value === 1) {
                clearInterval(video.timers.next);
              } else {
                document.getElementById("next-episode-count").innerText =
                  value - 1;
              }
            }, 1000);
          }
        },
        error: function (error) {
          console.log(error);
        },
      });
    } catch (error) {
      console.log(error);
    }
  },

  playbackSpeed: function () {
    if (!video.speed.state) {
      var speedsOptions = `
        <ul id="speed-menu">
          <span></span>
          ${video.speed.options.map((e) => "<li>" + e + "</li>").join("")}
        </ul>
      `;

      video.speed.state = true;
      video.showOSD(true);
      $("#setting-options").hide();
      $(".player-settings").append(speedsOptions);

      video.setSpeed(0);
      return true;
    }
    video.hidePlaySpeed();
    video.showOSD();
    return false;
  },

  hidePlaySpeed: function () {
    $("#speed-menu").remove();
    $("#setting-options").show();
    video.speed.state = false;
  },

  setSpeed: function (increment) {
    var index = video.speed.options.indexOf(video.speed.active);
    var newIndex = index + increment;
    if (newIndex >= 0 && newIndex < video.speed.options.length) {
      if (newIndex === 3) {
        var count = 0;
        var width = 50;
        $("#speed-menu").removeClass("to-rigth");
        $("#speed-menu").removeClass("to-left");
        var classDirection = "";
      } else if (newIndex > 3) {
        var count = newIndex - 3;
        var width = 50 + count * 75;
        var classDirection = "to-rigth";
      } else {
        var count = 3 - newIndex;
        var width = 50 + count * 75;
        var classDirection = "to-left";
      }

      $("#speed-menu").addClass(classDirection);
      $("#speed-menu span").css("width", width);

      video.speed.active = video.speed.options[newIndex];
      player.speed(video.speed.options[newIndex]);
    }
  },

  showOSD: function (noHide) {
    clearTimeout(video.timers.osd.object);
    var osd = document.getElementById("osd");
    osd.style.opacity = 1;
    if (!noHide) {
      video.timers.osd.object = setTimeout(() => {
        video.hideOSD();
      }, video.timers.osd.duration);
    }
  },

  hideOSD: function () {
    video.option = false;
    $("#setting-options").children().removeClass("selected");
    video.timers.osd.object = null;
    var osd = document.getElementById("osd");
    osd.style.opacity = 0;
  },

  showBTN: function (state, data) {
    var button = document.getElementById("osd-icon");
    if (button) {
      button.style.opacity = 1;
      button.className = `icon-status ${state}`;
    }
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
      time >= video.credits.start
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
