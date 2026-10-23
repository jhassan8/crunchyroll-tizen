window.subtitleTranslate = {
  enabled: false,
  mode: "off",
  cues: [],
  cueIndex: 0,
  lastText: "",
  overlay: null,
  originalEl: null,
  translatedEl: null,
  nativeTracks: [],
  onCueChange: null,

  interceptSubtitleText: function (originalText) {
    var text = subtitleTranslate.cleanText(originalText);
    if (!text) {
      subtitleTranslate.hide();
      return Promise.resolve("");
    }
    if (text === subtitleTranslate.lastText) {
      return Promise.resolve(text);
    }
    subtitleTranslate.lastText = text;
    subtitleTranslate.show(text, "");
    return Promise.resolve(text);
  },

  ensureOverlay: function () {
    subtitleTranslate.overlay = document.getElementById("subtitle-overlay");
    if (!subtitleTranslate.overlay) {
      return;
    }
    subtitleTranslate.translatedEl = document.getElementById(
      "subtitle-overlay-en"
    );
    subtitleTranslate.originalEl = document.getElementById(
      "subtitle-overlay-ja"
    );
  },

  show: function (translated, original) {
    subtitleTranslate.ensureOverlay();
    if (!subtitleTranslate.overlay) {
      return;
    }
    subtitleTranslate.translatedEl.textContent = translated || "";
    subtitleTranslate.originalEl.textContent = original || "";
    subtitleTranslate.overlay.style.display = "flex";
  },

  hide: function () {
    subtitleTranslate.ensureOverlay();
    subtitleTranslate.lastText = "";
    if (!subtitleTranslate.overlay) {
      return;
    }
    subtitleTranslate.translatedEl.textContent = "";
    subtitleTranslate.originalEl.textContent = "";
    subtitleTranslate.overlay.style.display = "none";
  },

  start: function (options) {
    options = options || {};
    subtitleTranslate.stop();
    subtitleTranslate.enabled = true;
    subtitleTranslate.mode = options.mode || "official-en";
    subtitleTranslate.ensureOverlay();
    subtitleTranslate.resolveSoftUrl(options, function (url) {
      if (url) {
        subtitleTranslate.loadSoftTrack(url);
      }
    });
  },

  stop: function () {
    subtitleTranslate.enabled = false;
    subtitleTranslate.mode = "off";
    subtitleTranslate.cues = [];
    subtitleTranslate.cueIndex = 0;
    subtitleTranslate.detachNativeTracks();
    subtitleTranslate.hide();
  },

  resolveSoftUrl: function (options, done) {
    var fromPayload = subtitleTranslate.pickEnglishSoftUrl(options.playData);
    if (fromPayload) {
      done(fromPayload);
      return;
    }
    if (options.softUrl) {
      done(options.softUrl);
      return;
    }
    var versions = options.versions || [];
    var jp = null;
    for (var i = 0; i < versions.length; i++) {
      if (String(versions[i].name || "").indexOf("ja") === 0) {
        jp = versions[i];
        break;
      }
    }
    if (!jp || !jp.id || jp.id === options.episodeId) {
      done(null);
      return;
    }
    service.video_v2({
      data: { id: jp.id },
      success: function (jpData) {
        done(subtitleTranslate.pickEnglishSoftUrl(jpData));
      },
      error: function () {
        done(null);
      },
    });
  },

  loadSoftTrack: function (url) {
    fetch(url)
      .then(function (res) {
        return res.text();
      })
      .then(function (body) {
        if (!subtitleTranslate.enabled) {
          return;
        }
        subtitleTranslate.cues = subtitleTranslate.parseSubtitleFile(body);
      })
      .catch(function (error) {
        console.log("soft subtitle load failed", error);
      });
  },

  parseSubtitleFile: function (body) {
    if (!body) {
      return [];
    }
    var trimmed = body.replace(/^\uFEFF/, "");
    if (trimmed.indexOf("WEBVTT") === 0) {
      return subtitleTranslate.parseVtt(trimmed);
    }
    if (trimmed.indexOf("[Events]") >= 0 || trimmed.indexOf("Dialogue:") >= 0) {
      return subtitleTranslate.parseAss(trimmed);
    }
    return subtitleTranslate.parseSrt(trimmed);
  },

  parseVtt: function (body) {
    var blocks = body.replace(/\r/g, "").split("\n\n");
    var cues = [];
    for (var i = 0; i < blocks.length; i++) {
      var lines = blocks[i].split("\n").filter(function (line) {
        return line && line.indexOf("WEBVTT") !== 0 && line.indexOf("NOTE") !== 0;
      });
      var timeLine = lines.filter(function (line) {
        return line.indexOf("-->") >= 0;
      })[0];
      if (!timeLine) {
        continue;
      }
      var times = timeLine.split("-->");
      var text = lines
        .filter(function (line) {
          return line.indexOf("-->") < 0 && !/^\d+$/.test(line);
        })
        .join("\n");
      var cleaned = subtitleTranslate.cleanText(text);
      if (cleaned) {
        cues.push({
          start: subtitleTranslate.parseTimestamp(times[0]),
          end: subtitleTranslate.parseTimestamp(times[1]),
          text: cleaned,
        });
      }
    }
    return cues;
  },

  parseSrt: function (body) {
    return subtitleTranslate.parseVtt("WEBVTT\n\n" + body.replace(/,/g, "."));
  },

  parseAss: function (body) {
    var lines = body.replace(/\r/g, "").split("\n");
    var cues = [];
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].indexOf("Dialogue:") !== 0) {
        continue;
      }
      var payload = lines[i].slice("Dialogue:".length);
      var parts = payload.split(",");
      if (parts.length < 10) {
        continue;
      }
      cues.push({
        start: subtitleTranslate.parseTimestamp(parts[1]),
        end: subtitleTranslate.parseTimestamp(parts[2]),
        text: subtitleTranslate.cleanText(parts.slice(9).join(",")),
      });
    }
    return cues;
  },

  parseTimestamp: function (value) {
    var cleaned = (value || "").trim().split(" ")[0].replace(",", ".");
    var pieces = cleaned.split(":");
    if (pieces.length < 2) {
      return 0;
    }
    var hours = pieces.length === 3 ? Number(pieces[0]) : 0;
    var minutes = Number(pieces[pieces.length === 3 ? 1 : 0]);
    var seconds = Number(pieces[pieces.length === 3 ? 2 : 1]);
    return hours * 3600 + minutes * 60 + seconds;
  },

  cleanText: function (value) {
    return String(value || "")
      .replace(/\{\\[^}]*\}/g, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\\N/g, "\n")
      .replace(/\\n/g, "\n")
      .replace(/\\h/g, " ")
      .replace(/\s+\n/g, "\n")
      .trim();
  },

  sync: function (time) {
    if (!subtitleTranslate.enabled) {
      return;
    }
    var cues = subtitleTranslate.cues;
    if (!cues.length) {
      return;
    }
    var active = subtitleTranslate.activeCue(time);
    if (active) {
      subtitleTranslate.interceptSubtitleText(active.text);
    } else if (subtitleTranslate.lastText) {
      subtitleTranslate.hide();
    }
  },

  activeCue: function (time) {
    var cues = subtitleTranslate.cues;
    var index = subtitleTranslate.cueIndex;
    if (cues[index] && time >= cues[index].start && time <= cues[index].end) {
      return cues[index];
    }
    for (var i = 0; i < cues.length; i++) {
      if (time >= cues[i].start && time <= cues[i].end) {
        subtitleTranslate.cueIndex = i;
        return cues[i];
      }
    }
    return null;
  },

  attachPlayer: function (mediaPlayer, videoEl) {
    if (!subtitleTranslate.enabled || !mediaPlayer) {
      return;
    }
    try {
      mediaPlayer.updateSettings({
        streaming: {
          text: {
            defaultEnabled: true,
          },
        },
      });
    } catch (error) {}

    var onCue = function (event) {
      var text =
        (event && event.cue && (event.cue.text || event.cue.payload)) ||
        (event && event.text) ||
        "";
      subtitleTranslate.interceptSubtitleText(text);
    };
    try {
      mediaPlayer.on("cueEnter", onCue);
    } catch (error) {}

    subtitleTranslate.bindNativeTracks(videoEl);
  },

  bindNativeTracks: function (videoEl) {
    subtitleTranslate.detachNativeTracks();
    if (!videoEl || !videoEl.textTracks) {
      return;
    }
    subtitleTranslate.onCueChange = function (event) {
      var track = event.target;
      var active = track.activeCues && track.activeCues[0];
      subtitleTranslate.interceptSubtitleText(active ? active.text : "");
    };
    for (var i = 0; i < videoEl.textTracks.length; i++) {
      var track = videoEl.textTracks[i];
      track.mode = "hidden";
      track.addEventListener("cuechange", subtitleTranslate.onCueChange);
      subtitleTranslate.nativeTracks.push(track);
    }
    videoEl.addEventListener("addtrack", function () {
      subtitleTranslate.bindNativeTracks(videoEl);
    });
  },

  detachNativeTracks: function () {
    if (!subtitleTranslate.onCueChange) {
      subtitleTranslate.nativeTracks = [];
      return;
    }
    for (var i = 0; i < subtitleTranslate.nativeTracks.length; i++) {
      subtitleTranslate.nativeTracks[i].removeEventListener(
        "cuechange",
        subtitleTranslate.onCueChange
      );
    }
    subtitleTranslate.nativeTracks = [];
  },

  pickEnglishSoftUrl: function (data) {
    if (!data) {
      return null;
    }
    var groups = [data.subtitles, data.captions, data.softSubs];
    for (var g = 0; g < groups.length; g++) {
      var group = groups[g];
      if (!group) {
        continue;
      }
      var preferred = group["en-US"] || group["en"] || group.enUS;
      if (preferred && preferred.url) {
        return preferred.url;
      }
      var keys = Object.keys(group);
      for (var i = 0; i < keys.length; i++) {
        if (keys[i].indexOf("en") === 0 && group[keys[i]].url) {
          return group[keys[i]].url;
        }
      }
    }
    return null;
  },
};
