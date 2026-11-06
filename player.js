// কাস্টম ভিডিও প্লেয়ার: বড় প্লে বাটন, প্লে/পজ, সময়, প্রগ্রেস বার, শব্দ ও ফুলস্ক্রিন।
(function () {
  'use strict';

  var BANGLA_DIGITS = '০১২৩৪৫৬৭৮৯';
  var SEEK_STEP = 5;

  function toBangla(str) {
    return String(str).replace(/\d/g, function (d) { return BANGLA_DIGITS[d]; });
  }

  function formatTime(seconds) {
    if (!isFinite(seconds)) { return '০:০০'; }
    var s = Math.floor(seconds % 60);
    var m = Math.floor(seconds / 60);
    return toBangla(m + ':' + (s < 10 ? '0' : '') + s);
  }

  document.querySelectorAll('.player').forEach(function (player) {
    var video = player.querySelector('video');
    var bigPlay = player.querySelector('.player__big');
    var playBtn = player.querySelector('[data-action="play"]');
    var muteBtn = player.querySelector('[data-action="mute"]');
    var fullBtn = player.querySelector('[data-action="full"]');
    var progress = player.querySelector('.player__progress');
    var fill = player.querySelector('.player__fill');
    var timeEl = player.querySelector('.player__time');
    if (!video) { return; }

    function togglePlay() {
      if (video.paused) { video.play().catch(function () {}); } else { video.pause(); }
    }

    function render() {
      var pct = video.duration ? (video.currentTime / video.duration) * 100 : 0;
      fill.style.width = pct + '%';
      progress.setAttribute('aria-valuenow', String(Math.round(pct)));
      timeEl.textContent = formatTime(video.currentTime) + ' / ' + formatTime(video.duration);
    }

    function setState() {
      var playing = !video.paused && !video.ended;
      player.classList.toggle('is-playing', playing);
      playBtn.setAttribute('aria-label', playing ? 'থামান' : 'চালান');
    }

    function seekTo(clientX) {
      var rect = progress.getBoundingClientRect();
      var ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      if (video.duration) { video.currentTime = ratio * video.duration; }
    }

    bigPlay.addEventListener('click', togglePlay);
    playBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);
    video.addEventListener('play', setState);
    video.addEventListener('pause', setState);
    video.addEventListener('ended', setState);
    video.addEventListener('timeupdate', render);
    video.addEventListener('loadedmetadata', render);

    muteBtn.addEventListener('click', function () {
      video.muted = !video.muted;
      player.classList.toggle('is-muted', video.muted);
      muteBtn.setAttribute('aria-label', video.muted ? 'শব্দ চালু করুন' : 'শব্দ বন্ধ করুন');
    });

    fullBtn.addEventListener('click', function () {
      if (document.fullscreenElement) { document.exitFullscreen(); return; }
      if (player.requestFullscreen) { player.requestFullscreen(); }
      else if (video.webkitEnterFullscreen) { video.webkitEnterFullscreen(); }
    });

    progress.addEventListener('click', function (e) { seekTo(e.clientX); });
    progress.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { video.currentTime = Math.min(video.currentTime + SEEK_STEP, video.duration || 0); }
      if (e.key === 'ArrowLeft') { video.currentTime = Math.max(video.currentTime - SEEK_STEP, 0); }
    });

    render();
  });
})();
