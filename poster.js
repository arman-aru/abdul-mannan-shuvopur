// সমর্থন পোস্ট জেনারেটর: সমর্থকের ছবি + নাম দিয়ে ১০৮০x১০৮০ পোস্ট তৈরি।
// সবকিছু ব্রাউজারেই হয়; কোনো ছবি বা তথ্য কোথাও আপলোড হয় না।
(function () {
  'use strict';

  var SIZE = 1080;
  var COLORS = { navy: '#0b1d36', navy2: '#13294b', blue: '#2f6fd0', gold: '#e9bc55', white: '#ffffff', soft: 'rgba(255,255,255,.75)' };
  var FONT_DISPLAY = '"Noto Serif Bengali", serif';
  var FONT_BODY = '"Noto Serif Bengali", serif';
  var DEFAULT_NAME = 'আপনার নাম';
  var FILE_NAME = 'shuvopur-mannan-somorthon.png';
  var LEADER_SRC = [
    'images/leader-ziaur-rahman.png',
    'images/leader-khaleda-zia.png',
    'images/leader-tarique-rahman.png',
    'images/mp-portrait.jpg'
  ];

  var canvas = document.getElementById('poster-canvas');
  if (!canvas) { return; }
  var ctx = canvas.getContext('2d');
  var nameInput = document.getElementById('poster-name');
  var wardSelect = document.getElementById('poster-ward');
  var photoInput = document.getElementById('poster-photo');
  var downloadBtn = document.getElementById('poster-download');
  var shareBtn = document.getElementById('poster-share');
  var errorEl = document.getElementById('poster-error');
  var fileNameEl = document.getElementById('poster-file-name');

  var assets = { cutout: null, leaders: [], photo: null };

  function loadImage(src) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { resolve(null); };
      img.src = src;
    });
  }

  function circleImage(img, cx, cy, r) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    if (img) {
      var scale = Math.max((r * 2) / img.width, (r * 2) / img.height);
      var w = img.width * scale, h = img.height * scale;
      ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
    } else {
      ctx.fillStyle = COLORS.navy2;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    }
    ctx.restore();
  }

  function ring(cx, cy, r, width, color) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  function text(str, x, y, font, color, align) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align || 'left';
    ctx.fillText(str, x, y);
  }

  function fitFont(str, maxWidth, weight, startSize, family) {
    var size = startSize;
    ctx.font = weight + ' ' + size + 'px ' + family;
    while (ctx.measureText(str).width > maxWidth && size > 18) {
      size -= 2;
      ctx.font = weight + ' ' + size + 'px ' + family;
    }
    return ctx.font;
  }

  function drawBackground() {
    var bg = ctx.createLinearGradient(0, 0, SIZE, SIZE);
    bg.addColorStop(0, COLORS.navy);
    bg.addColorStop(1, COLORS.navy2);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, SIZE, SIZE);
    var glow = ctx.createRadialGradient(800, 640, 40, 800, 640, 470);
    glow.addColorStop(0, 'rgba(47,111,208,.55)');
    glow.addColorStop(1, 'rgba(47,111,208,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, SIZE, SIZE);
  }

  function drawLeaders() {
    var d = 112, gap = 18, x = 60, y = 48;
    assets.leaders.forEach(function (img, i) {
      var cx = x + d / 2 + i * (d + gap), cy = y + d / 2;
      circleImage(img, cx, cy, d / 2);
      ring(cx, cy, d / 2 + 3, 5, i === 3 ? COLORS.blue : COLORS.white);
    });
    text('৯ নং শুভপুর ইউনিয়ন', SIZE - 60, 96, '600 28px ' + FONT_BODY, COLORS.gold, 'right');
    text('ছাগলনাইয়া, ফেনী', SIZE - 60, 132, '400 24px ' + FONT_BODY, COLORS.soft, 'right');
  }

  function drawHeadline() {
    var name = 'আব্দুল মান্নান মিয়াজী';
    text('আমার সমর্থন', 60, 250, '700 50px ' + FONT_DISPLAY, COLORS.white);
    text(name, 60, 330, fitFont(name, 620, '800', 62, FONT_DISPLAY), COLORS.gold);
    text('চেয়ারম্যান পদে বিএনপির মনোনয়নপ্রত্যাশী', 60, 380, '500 26px ' + FONT_BODY, COLORS.soft);
  }

  function drawSupporter() {
    var cx = 230, cy = 600, r = 135;
    ring(cx, cy, r + 14, 6, COLORS.blue);
    circleImage(assets.photo, cx, cy, r);
    ring(cx, cy, r + 4, 8, COLORS.white);
    if (!assets.photo) {
      text('আপনার ছবি', cx, cy + 12, '500 30px ' + FONT_BODY, COLORS.soft, 'center');
    }
    var name = (nameInput.value || '').trim() || DEFAULT_NAME;
    text(name, cx, 800, fitFont(name, 400, '700', 40, FONT_BODY), COLORS.white, 'center');
    var ward = wardSelect.value;
    var line = ward ? ward + ' নং ওয়ার্ড, শুভপুর' : 'শুভপুর ইউনিয়নের ভোটার';
    text(line, cx, 846, '400 26px ' + FONT_BODY, COLORS.soft, 'center');
  }

  function drawCutout() {
    var img = assets.cutout;
    if (!img) { return; }
    var w = 600, h = img.height * (w / img.width);
    ctx.drawImage(img, 470, 930 - h, w, h);
  }

  function drawFooter() {
    var slogan = 'সৎ, স্বাবলম্বী ও পরীক্ষিত নেতৃত্বে এগিয়ে যাক শুভপুর';
    ctx.fillStyle = COLORS.blue;
    ctx.fillRect(0, 930, SIZE, 150);
    text(slogan, SIZE / 2, 1000, fitFont(slogan, 960, '700', 38, FONT_DISPLAY), COLORS.white, 'center');
    text('#শুভপুরের_সাথে_মান্নান', SIZE / 2, 1046, '600 26px ' + FONT_BODY, COLORS.gold, 'center');
  }

  function draw() {
    ctx.clearRect(0, 0, SIZE, SIZE);
    drawBackground();
    drawLeaders();
    drawHeadline();
    drawCutout();
    drawSupporter();
    drawFooter();
  }

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = !message;
  }

  photoInput.addEventListener('change', function () {
    var file = photoInput.files && photoInput.files[0];
    if (!file) { return; }
    if (fileNameEl) { fileNameEl.textContent = file.name; }
    if (!/^image\//.test(file.type)) { showError('অনুগ্রহ করে একটি ছবি (JPG বা PNG) বেছে নিন।'); return; }
    showError('');
    var reader = new FileReader();
    reader.onload = function () {
      loadImage(reader.result).then(function (img) {
        if (!img) { showError('ছবিটি খোলা যায়নি, অন্য একটি ছবি দিন।'); return; }
        assets.photo = img;
        draw();
      });
    };
    reader.onerror = function () { showError('ছবিটি পড়া যায়নি, আবার চেষ্টা করুন।'); };
    reader.readAsDataURL(file);
  });

  nameInput.addEventListener('input', draw);
  wardSelect.addEventListener('change', draw);

  function toBlob() {
    return new Promise(function (resolve) { canvas.toBlob(resolve, 'image/png'); });
  }

  downloadBtn.addEventListener('click', function () {
    toBlob().then(function (blob) {
      if (!blob) { showError('ছবি তৈরি করা যায়নি, আবার চেষ্টা করুন।'); return; }
      var link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = FILE_NAME;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(function () { URL.revokeObjectURL(link.href); }, 1000);
    });
  });

  shareBtn.addEventListener('click', function () {
    toBlob().then(function (blob) {
      if (!blob) { showError('ছবি তৈরি করা যায়নি, আবার চেষ্টা করুন।'); return; }
      var file = new File([blob], FILE_NAME, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], text: 'আমার সমর্থন আব্দুল মান্নান মিয়াজী #শুভপুরের_সাথে_মান্নান। আপনিও বানান: ' + new URL('post.html', window.location.href).href }).catch(function () {});
      } else {
        showError('এই ডিভাইসে সরাসরি শেয়ার হয় না। “ডাউনলোড করুন” চেপে ছবিটি ফেসবুকে পোস্ট করুন।');
      }
    });
  });

  var fontsReady = document.fonts && document.fonts.load
    ? Promise.all([document.fonts.load('400 40px "Noto Serif Bengali"'), document.fonts.load('700 40px "Noto Serif Bengali"')])
    : Promise.resolve();

  Promise.all([fontsReady, loadImage('images/mannan-cutout.png'), Promise.all(LEADER_SRC.map(loadImage))])
    .then(function (results) {
      assets.cutout = results[1];
      assets.leaders = results[2];
      draw();
    });
})();
