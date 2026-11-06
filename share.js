// পোস্ট পাতার লিংক শেয়ার: কপি, ফেসবুক ও হোয়াটসঅ্যাপ।
(function () {
  'use strict';

  var COPIED_RESET_MS = 2000;
  var SHARE_TEXT = 'আমি আব্দুল মান্নান মিয়াজীর সমর্থনে পোস্ট বানিয়েছি। আপনিও নিজের ছবি দিয়ে বানান:';

  var pageUrl = window.location.href.split('#')[0].split('?')[0];
  var urlEl = document.getElementById('share-url');
  var copyBtn = document.getElementById('share-copy');
  var fbLink = document.getElementById('share-fb');
  var waLink = document.getElementById('share-wa');
  if (!urlEl || !copyBtn) { return; }

  urlEl.textContent = pageUrl;
  fbLink.href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl);
  waLink.href = 'https://wa.me/?text=' + encodeURIComponent(SHARE_TEXT + ' ' + pageUrl);

  function legacyCopy(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(area);
    return ok;
  }

  copyBtn.addEventListener('click', function () {
    var ok = legacyCopy(pageUrl);
    copyBtn.textContent = ok ? 'কপি হয়েছে ✓' : 'নিজে কপি করুন';
    copyBtn.classList.toggle('is-copied', ok);
    if (!ok) {
      var range = document.createRange();
      range.selectNodeContents(urlEl);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
    setTimeout(function () { copyBtn.textContent = 'লিংক কপি করুন'; copyBtn.classList.remove('is-copied'); }, COPIED_RESET_MS);
  });
})();
