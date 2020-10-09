(() => {
  // mp3.js
  /*!
   *  Howler.js Audio Player Demo
   *  howlerjs.com
   *
   *  (c) 2013-2020, James Simpson of GoldFire Studios
   *  goldfirestudios.com
   *
   *  MIT License
   */
  var elms = ["track", "timer", "duration", "playBtn", "pauseBtn", "prevBtn", "nextBtn", "playlistBtn", "volumeBtn", "progress", "bar", "wave", "loading", "playlist", "list", "volume", "barEmpty", "barFull", "sliderBtn"];
  elms.forEach(function(elm) {
    window[elm] = document.getElementById(elm);
  });
  function Draw(Howler2) {
    function radomHex() {
      var ret = "#" + (Math.random() * 16777215 << 0).toString(16);
      return ret.length < 7 ? ret + "f" : ret;
    }
    var rColor = Array.from(new Array(4), () => radomHex());
    function gradient(ctx, x0, x1, y1) {
      var gradient2 = ctx.createLinearGradient(x0, 0, x1, y1);
      for (var i = 0, len = rColor.length; i < len; i++) {
        gradient2.addColorStop(i / len, rColor[len - 1 - i]);
      }
      return gradient2;
    }
    function curry(fn) {
      var args = Array.prototype.slice.call(arguments, 1);
      return function() {
        var innerArgs = Array.prototype.slice.call(arguments);
        var finalArgs = args.concat(innerArgs);
        return fn.call(null, ...finalArgs);
      };
    }
    var analyser = Howler2.ctx.createAnalyser();
    Howler2.masterGain.connect(analyser);
    analyser.connect(Howler2.ctx.destination);
    analyser.fftSize = 2048;
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.85;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);
    var canvas = document.getElementById("canvas");
    var banner = $(".about-banner");
    canvas.height = banner.height();
    canvas.width = banner.width();
    var canvasCtx = canvas.getContext("2d", {alpha: false});
    var _gradient = curry(gradient, canvasCtx);
    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;
    var globalID;
    this.init = function() {
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      globalID = requestAnimationFrame(this.init.bind(this));
      analyser.getByteFrequencyData(dataArray);
      canvasCtx.fillStyle = "rgba(0, 0, 0, 0)";
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      var barWidth = 3;
      var x = 0;
      for (var i = 0; i < bufferLength; i += barWidth) {
        var barHeight = dataArray[i];
        const x0 = x;
        const y0 = 0;
        const x1 = Math.floor(barWidth);
        const y1 = Math.floor(barHeight / 0.9);
        canvasCtx.fillStyle = _gradient(x0, x0, y1);
        canvasCtx.fillRect(x0, y0, x1, y1);
        x += barWidth + 1;
      }
    };
    this.pause = function() {
      cancelAnimationFrame(globalID);
    };
  }
  var Mp3 = function(playlist2) {
    this.playlist = playlist2;
    this.index = 0;
    track.innerHTML = "1. " + playlist2[0].title;
    playlist2.forEach(function(song) {
      var div = document.createElement("div");
      div.className = "list-song";
      div.innerHTML = song.title;
      div.onclick = function() {
        player.skipTo(playlist2.indexOf(song));
      };
      list.appendChild(div);
    });
  };
  Mp3.prototype = {
    play: function(index) {
      var self = this;
      var sound;
      index = typeof index === "number" ? index : self.index;
      var data = self.playlist[index];
      if (data.howl) {
        sound = data.howl;
      } else {
        sound = data.howl = new Howl({
          src: ["/media/audio/" + data.file + ".webm", "/media/audio/" + data.file + ".mp3"],
          html5: false,
          onplay: function(data2) {
            var draw = new Draw(Howler);
            draw.init();
            duration.innerHTML = self.formatTime(Math.round(sound.duration()));
            requestAnimationFrame(self.step.bind(self));
            pauseBtn.style.display = "block";
          },
          onload: function() {
            loading.style.display = "none";
          },
          onend: function() {
            self.skip("next");
          },
          onpause: function() {
          },
          onstop: function() {
          },
          onseek: function() {
            requestAnimationFrame(self.step.bind(self));
          }
        });
      }
      sound.play();
      track.innerHTML = index + 1 + ". " + data.title;
      if (sound.state() === "loaded") {
        playBtn.style.display = "none";
        pauseBtn.style.display = "block";
      } else {
        loading.style.display = "block";
        playBtn.style.display = "none";
        pauseBtn.style.display = "none";
      }
      self.index = index;
    },
    pause: function() {
      var self = this;
      var sound = self.playlist[self.index].howl;
      sound.pause();
      playBtn.style.display = "block";
      pauseBtn.style.display = "none";
    },
    skip: function(direction) {
      var self = this;
      var index = 0;
      if (direction === "prev") {
        index = self.index - 1;
        if (index < 0) {
          index = self.playlist.length - 1;
        }
      } else {
        index = self.index + 1;
        if (index >= self.playlist.length) {
          index = 0;
        }
      }
      self.skipTo(index);
    },
    skipTo: function(index) {
      var self = this;
      if (self.playlist[self.index].howl) {
        self.playlist[self.index].howl.stop();
      }
      progress.style.width = "0%";
      self.play(index);
    },
    volume: function(val) {
      var self = this;
      Howler.volume(val);
      var barWidth = val * 90 / 100;
      barFull.style.width = barWidth * 100 + "%";
      sliderBtn.style.left = window.innerWidth * barWidth + window.innerWidth * 0.05 - 25 + "px";
    },
    seek: function(per) {
      var self = this;
      var sound = self.playlist[self.index].howl;
      if (sound.playing()) {
        sound.seek(sound.duration() * per);
      }
    },
    step: function() {
      var self = this;
      var sound = self.playlist[self.index].howl;
      var seek = sound.seek() || 0;
      timer.innerHTML = self.formatTime(Math.round(seek));
      progress.style.width = (seek / sound.duration() * 100 || 0) + "%";
      if (sound.playing()) {
        requestAnimationFrame(self.step.bind(self));
      }
    },
    togglePlaylist: function() {
      var self = this;
      var display = playlist.style.display === "block" ? "none" : "block";
      setTimeout(function() {
        playlist.style.display = display;
      }, display === "block" ? 0 : 500);
      playlist.className = display === "block" ? "fadein" : "fadeout";
    },
    toggleVolume: function() {
      var self = this;
      var display = volume.style.display === "block" ? "none" : "block";
      setTimeout(function() {
        volume.style.display = display;
      }, display === "block" ? 0 : 500);
      volume.className = display === "block" ? "fadein" : "fadeout";
    },
    formatTime: function(secs) {
      var minutes = Math.floor(secs / 60) || 0;
      var seconds = secs - minutes * 60 || 0;
      return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }
  };
  var player = new Mp3([
    {
      title: "Rave Digger",
      file: "rave_digger",
      howl: null
    },
    {
      title: "80s Vibe",
      file: "80s_vibe",
      howl: null
    },
    {
      title: "Running Out",
      file: "running_out",
      howl: null
    }
  ]);
  playBtn.addEventListener("click", function() {
    player.play();
  });
  pauseBtn.addEventListener("click", function() {
    player.pause();
  });
  prevBtn.addEventListener("click", function() {
    player.skip("prev");
  });
  nextBtn.addEventListener("click", function() {
    player.skip("next");
  });
  waveform.addEventListener("click", function(event) {
    player.seek(event.clientX / window.innerWidth);
  });
  playlistBtn.addEventListener("click", function() {
    player.togglePlaylist();
  });
  playlist.addEventListener("click", function() {
    player.togglePlaylist();
  });
  volumeBtn.addEventListener("click", function() {
    player.toggleVolume();
  });
  volume.addEventListener("click", function() {
    player.toggleVolume();
  });
  barEmpty.addEventListener("click", function(event) {
    var per = event.layerX / parseFloat(barEmpty.scrollWidth);
    player.volume(per);
  });
  sliderBtn.addEventListener("mousedown", function() {
    window.sliderDown = true;
  });
  sliderBtn.addEventListener("touchstart", function() {
    window.sliderDown = true;
  });
  volume.addEventListener("mouseup", function() {
    window.sliderDown = false;
  });
  volume.addEventListener("touchend", function() {
    window.sliderDown = false;
  });
  var move = function(event) {
    if (window.sliderDown) {
      var x = event.clientX || event.touches[0].clientX;
      var startX = window.innerWidth * 0.05;
      var layerX = x - startX;
      var per = Math.min(1, Math.max(0, layerX / parseFloat(barEmpty.scrollWidth)));
      player.volume(per);
    }
  };
  volume.addEventListener("mousemove", move);
  volume.addEventListener("touchmove", move);
})();
